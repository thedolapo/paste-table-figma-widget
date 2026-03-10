const { widget } = figma;
const { useSyncedState, useEffect, waitForTask, AutoLayout, Text, Input } = widget;
import { UI_HTML } from "../src/ui-html.generated";
import { parseTableInput } from "../src/parser";
import { validateTableData } from "../src/validation";
import type { TableData } from "../src/types";

let pasteTargetNodeId: string | null = null;
let resolvePasteUiPromise: (() => void) | null = null;

function getSelectionId(): string | null {
  const sel = figma.currentPage.selection;
  if (!sel || sel.length === 0) return null;
  const first = sel[0];
  return first ? first.id : null;
}

function createNewTable(data: TableData) {
  const widgetId = figma.widgetId;
  if (!widgetId) {
    figma.ui.postMessage({
      type: "error",
      message:
        "Insert a Paste Table widget from the Widgets menu first, then run Import or Create new table.",
    });
    if (resolvePasteUiPromise) {
      resolvePasteUiPromise();
      resolvePasteUiPromise = null;
    }
    return;
  }
  figma.loadAllPagesAsync().then(() => {
    const existing = figma.root.findWidgetNodesByWidgetId(widgetId);
    if (existing.length === 0) {
      figma.ui.postMessage({
        type: "error",
        message:
          "Insert a Paste Table widget from the Widgets menu first, then run Import or Create new table.",
      });
      if (resolvePasteUiPromise) {
        resolvePasteUiPromise();
        resolvePasteUiPromise = null;
      }
      return;
    }
    const source = existing[0] as WidgetNode;
    const cloned = source.cloneWidget({ tableData: data });
    cloned.x = figma.viewport.center.x - cloned.width / 2;
    cloned.y = figma.viewport.center.y - cloned.height / 2;
    figma.currentPage.appendChild(cloned);
    figma.viewport.scrollAndZoomIntoView([cloned]);
    figma.currentPage.selection = [cloned];
    figma.notify("Table created");
    figma.ui.close();
    if (resolvePasteUiPromise) {
      resolvePasteUiPromise();
      resolvePasteUiPromise = null;
    }
  });
}

function handlePasteMessage(msg: { type: string; payload?: string }) {
  const text = typeof msg.payload === "string" ? msg.payload.trim() : "";
  if (msg.type !== "import" && msg.type !== "create") return;
  const parseResult = parseTableInput(text);
  if (!parseResult.ok) {
    figma.ui.postMessage({ type: "error", message: parseResult.reason });
    return;
  }
  const validation = validateTableData(parseResult.data);
  if (!validation.ok) {
    figma.ui.postMessage({ type: "error", message: validation.reason });
    return;
  }
  const data = parseResult.data;
  if (msg.type === "import" && pasteTargetNodeId) {
    figma.getNodeByIdAsync(pasteTargetNodeId).then((node) => {
      if (node && node.type === "WIDGET" && node.widgetId === figma.widgetId) {
        (node as WidgetNode).setWidgetSyncedState({ tableData: data });
        figma.notify("Table updated");
        figma.ui.close();
        if (resolvePasteUiPromise) {
          resolvePasteUiPromise();
          resolvePasteUiPromise = null;
        }
      } else {
        createNewTable(data);
      }
    });
  } else {
    createNewTable(data);
  }
}

function TableWidget() {
  const [tableData, setTableData] = useSyncedState<TableData | null>("tableData", null);
  const [pasteUiAutoOpened, setPasteUiAutoOpened] = useSyncedState<boolean>("pasteUiAutoOpened", false);

  function openPasteUi() {
    pasteTargetNodeId = getSelectionId();
    figma.showUI(UI_HTML, { width: 420, height: 380, title: "Paste Table" });
    figma.ui.onmessage = handlePasteMessage;
    return new Promise<void>((resolve) => {
      resolvePasteUiPromise = resolve;
    });
  }

  useEffect(() => {
    if (!tableData && !pasteUiAutoOpened) {
      setPasteUiAutoOpened(true);
      waitForTask(openPasteUi());
    }
  });

  if (!tableData) {
    return (
      <AutoLayout direction="vertical" padding={16} fill="#F5F5F5" cornerRadius={8} spacing={8}>
        <AutoLayout
          direction="vertical"
          padding={12}
          fill="#EBEBEB"
          cornerRadius={6}
          spacing={4}
          stroke="#D0D0D0"
          strokeWidth={1}
          onClick={openPasteUi}
        >
          <Text fontSize={12} fill="#666">
            Paste table data in the plugin window
          </Text>
          <Text fontSize={11} fill="#999">
            Table data will appear here after you paste and create.
          </Text>
        </AutoLayout>
        <Text fontSize={11} fill="#0066cc" onClick={openPasteUi}>
          Open paste UI
        </Text>
      </AutoLayout>
    );
  }

  // Layout from Figma reference (node 106-3031): Table - Sheet1
  const cellWidth = 128;
  const headerRowHeight = 40;
  const bodyRowHeight = 55;
  const headerBg = "#F4F4F4";
  const strokeColor = "#E0E0E0";
  const headerFontWeight = 600;

  function setCellValue(rowIndex: number, colIndex: number, value: string) {
    if (!tableData) return;
    const newRows = tableData.rows.map((row, r) =>
      r === rowIndex
        ? {
            cells: row.cells.map((cell, c) =>
              c === colIndex ? { value } : cell
            ),
          }
        : row
    );
    setTableData({
      rows: newRows,
      columnCount: tableData.columnCount,
      rowCount: tableData.rowCount,
      hasHeaderRow: tableData.hasHeaderRow,
    });
  }

  const cellPadding = 8;

  return (
    <AutoLayout direction="vertical" padding={0} fill="#FFF" cornerRadius={8} stroke={strokeColor} spacing={0}>
      <AutoLayout direction="horizontal" padding={8} fill="#F8F8F8">
        <Text
          fontSize={11}
          fill="#666"
          onClick={openPasteUi}
        >
          Replace data
        </Text>
      </AutoLayout>
      {tableData.rows.map((row, rowIndex) => {
        const isHeaderRow = tableData.hasHeaderRow && rowIndex === 0;
        const rowHeight = isHeaderRow ? headerRowHeight : bodyRowHeight;
        return (
          <AutoLayout
            key={rowIndex}
            direction="horizontal"
            padding={0}
            height={rowHeight}
            verticalAlignItems="center"
            fill={isHeaderRow ? headerBg : "#FFF"}
            spacing={0}
          >
            {row.cells.map((cell, colIndex) => {
              if (isHeaderRow) {
                return (
                  <AutoLayout
                    key={colIndex}
                    width={cellWidth}
                    height={rowHeight}
                    verticalAlignItems="center"
                    padding={cellPadding}
                    stroke={strokeColor}
                    strokeWidth={1}
                  >
                    <Text fontSize={12} fontWeight={headerFontWeight} fill="#333">
                      {cell.value || " "}
                    </Text>
                  </AutoLayout>
                );
              }
              return (
                <AutoLayout
                  key={colIndex}
                  width={cellWidth}
                  height={rowHeight}
                  verticalAlignItems="center"
                  padding={cellPadding}
                  stroke={strokeColor}
                  strokeWidth={1}
                >
                  <Input
                    value={cell.value}
                    onTextEditEnd={(e) => setCellValue(rowIndex, colIndex, e.characters)}
                    width={cellWidth - cellPadding * 2}
                    inputBehavior="wrap"
                    fontSize={12}
                    fill="#333"
                  />
                </AutoLayout>
              );
            })}
          </AutoLayout>
        );
      })}
    </AutoLayout>
  );
}

widget.register(TableWidget);
