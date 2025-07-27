<template>
  <div class="create-diagram-container">
    <h2>建立/編輯 ER 圖</h2>
    <h3>ER 圖預覽</h3>
    <div ref="container" class="mermaid-container">
      <div ref="mermaidContainer" class="mermaid"></div>
    </div>

    <p>填寫下方表單以建立資料表與欄位</p>

    <div
      v-for="(table, tableIndex) in tables"
      :key="tableIndex"
      class="table-block"
    >
      <div
        class="table-header"
        @click="table.collapsed = !table.collapsed"
        title="點擊展開/收合欄位"
      >
        <strong>{{ table.name || '未命名資料表' }}</strong>
        <button type="button" class="toggle-btn">
          {{ table.collapsed ? '▶' : '▼' }}
        </button>
      </div>

      <div v-show="!table.collapsed" class="table-body">
        <input v-model="table.name" placeholder="資料表名稱" />
        <div
          v-for="(col, colIndex) in table.columns"
          :key="colIndex"
          class="column-row"
        >
          <input v-model="col.name" placeholder="欄位名稱" />
          <select v-model="col.type">
            <option value="string">string</option>
            <option value="int">int</option>
            <option value="datetime">datetime</option>
          </select>
          <label><input type="checkbox" v-model="col.pk" /> PK</label>
          <label><input type="checkbox" v-model="col.fk" /> FK</label>
          <select v-show="col.fk" v-model="col.ref">
            <option disabled value="">請選擇參考欄位</option>
            <option
              v-for="option in getReferenceOptions(table.name)"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <button
    class="delete-column-button"
    @click="removeColumn(table, colIndex)"
    title="刪除欄位"
  >
    🗑
  </button>
        </div>
        <button @click="addColumn(table)">新增欄位</button>
        
      </div>
    </div>

    <button @click="addTable">新增資料表</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import mermaid from 'mermaid'
import panzoom from 'panzoom'

interface Column {
  name: string
  type: string
  pk: boolean
  fk: boolean
  ref: string
}

interface Table {
  name: string
  columns: Column[]
  collapsed: boolean
}

const tables = reactive<Table[]>([
  {
    name: 'Project',
    collapsed: false,
    columns: [
      { name: 'id', type: 'string', pk: true, fk: false, ref: '' },
      { name: 'name', type: 'string', pk: false, fk: false, ref: '' },
      { name: 'description', type: 'string', pk: false, fk: false, ref: '' }
    ]
  }
])

const mermaidContainer = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)

function addTable() {
  tables.push({
    name: '',
    collapsed: false,
    columns: [{ name: '', type: 'string', pk: false, fk: false, ref: '' }]
  })
}

function addColumn(table: Table) {
  table.columns.push({ name: '', type: 'string', pk: false, fk: false, ref: '' })
}

function removeColumn(table: Table, colIndex: number) {
  table.columns.splice(colIndex, 1)
}

function removeTable(table : Table) {
    tables.pop(table)
}

function getReferenceOptions(currentTableName: string): string[] {
  const options: string[] = []
  for (const t of tables) {
    if (t.name === currentTableName) continue
    for (const col of t.columns) {
      if (col.name) {
        options.push(`${t.name}.${col.name}`)
      }
    }
  }
  return options
}

function generateMermaid(): string {
  let code = `erDiagram\n`
  for (const table of tables) {
    if (!table.name) continue
    code += `  ${table.name} {\n`
    for (const col of table.columns) {
      if (!col.name) continue
      code += `    ${col.type} ${col.name} ${col.pk ? 'PK' : ''} ${col.fk ? 'FK' : ''}\n`
    }
    code += `  }\n`
  }
  for (const table of tables) {
    for (const col of table.columns) {
      if (col.fk && col.ref) {
        const [refTable] = col.ref.split('.')
        code += `  ${table.name} }o--|| ${refTable} : "${col.name} to ${col.ref}"\n`
      }
    }
  }
  return code
}

async function renderDiagram() {
  if (!mermaidContainer.value) return
  const diagramId = 'mermaid-diagram-' + Date.now()
  const code = generateMermaid()
  try {
    const { svg } = await mermaid.render(diagramId, code)
    mermaidContainer.value.innerHTML = svg
    await nextTick()
    if (mermaidContainer.value) {
      panzoom(mermaidContainer.value, {
        zoomSpeed: 0.065,
        maxZoom: 4,
        minZoom: 0.2,
        bounds: true,
        boundsPadding: 0.1
      })
    }
  } catch (e) {
    mermaidContainer.value.innerHTML = `<pre class="error-message">渲染失敗\n\n${
      (e as Error).message
    }</pre>`
  }
}

onMounted(() => {
  mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })
  renderDiagram()
})

watch(tables, renderDiagram, { deep: true })
</script>

<style scoped>
.create-diagram-container {
  background: #f9fafb;
  padding: 20px;
  border-radius: 10px;
  max-width: 1200px;
  margin: 20px auto;
  color: #333;
}

.table-block {
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 6px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 1.1em;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.toggle-btn {
  background: none;
  border: none;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
  padding: 0 8px;
  line-height: 1;
}

.table-body {
  margin-top: 8px;
}

.column-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
}

input,
select {
  flex: 1;
  padding: 10px 14px;
  font-size: 1rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  background-color: #f9fafb;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  color: #334155;
  box-sizing: border-box;
}

input::placeholder,
select option[disabled] {
  color: #94a3b8;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
  background-color: #fff;
}

label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #475569;
  user-select: none;
}

button {
  padding: 8px 18px;
  font-size: 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

button:hover {
  background-color: #1d4ed8;
}

.mermaid-container {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
  background: white;
  overflow: hidden;
  height: 500px;
  position: relative;
  touch-action: none;
  cursor: grab;
}
</style>
