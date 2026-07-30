/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Database, 
  Plus, 
  Trash2, 
  Key, 
  Link2, 
  Code, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  Download, 
  RefreshCw,
  Table as TableIcon,
  HardDrive
} from 'lucide-react';
import { motion } from 'motion/react';

interface Column {
  id: string;
  name: string;
  type: 'INTEGER' | 'VARCHAR' | 'BOOLEAN' | 'TIMESTAMP' | 'UUID' | 'DECIMAL' | 'TEXT';
  isPrimary: boolean;
  isNullable: boolean;
  isForeignKey: boolean;
  referencesTable?: string;
}

interface Table {
  id: string;
  name: string;
  columns: Column[];
}

const INITIAL_TABLES: Table[] = [
  {
    id: 'tbl-users',
    name: 'users',
    columns: [
      { id: 'c1', name: 'id', type: 'UUID', isPrimary: true, isNullable: false, isForeignKey: false },
      { id: 'c2', name: 'full_name', type: 'VARCHAR', isPrimary: false, isNullable: false, isForeignKey: false },
      { id: 'c3', name: 'email', type: 'VARCHAR', isPrimary: false, isNullable: false, isForeignKey: false },
      { id: 'c4', name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isNullable: false, isForeignKey: false }
    ]
  },
  {
    id: 'tbl-orders',
    name: 'orders',
    columns: [
      { id: 'o1', name: 'id', type: 'UUID', isPrimary: true, isNullable: false, isForeignKey: false },
      { id: 'o2', name: 'user_id', type: 'UUID', isPrimary: false, isNullable: false, isForeignKey: true, referencesTable: 'users' },
      { id: 'o3', name: 'total_amount', type: 'DECIMAL', isPrimary: false, isNullable: false, isForeignKey: false },
      { id: 'o4', name: 'status', type: 'VARCHAR', isPrimary: false, isNullable: false, isForeignKey: false }
    ]
  }
];

export const DatabaseSchemaStudio: React.FC = () => {
  const { lang, isRtl } = useApp();
  const isAr = lang === 'ar';

  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [selectedTableId, setSelectedTableId] = useState<string>('tbl-users');
  const [exportFormat, setExportFormat] = useState<'postgresql' | 'mysql' | 'prisma'>('postgresql');
  const [copied, setCopied] = useState(false);

  // New Table State
  const [newTableName, setNewTableName] = useState('');

  // Selected Table & Column Edit State
  const selectedTable = tables.find(t => t.id === selectedTableId) || tables[0];

  const addTable = () => {
    if (!newTableName.trim()) return;
    const newTbl: Table = {
      id: `tbl-${Date.now()}`,
      name: newTableName.trim().toLowerCase().replace(/\s+/g, '_'),
      columns: [
        { id: `col-${Date.now()}-1`, name: 'id', type: 'UUID', isPrimary: true, isNullable: false, isForeignKey: false },
        { id: `col-${Date.now()}-2`, name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isNullable: false, isForeignKey: false }
      ]
    };
    setTables([...tables, newTbl]);
    setSelectedTableId(newTbl.id);
    setNewTableName('');
  };

  const deleteTable = (id: string) => {
    if (tables.length <= 1) return;
    const filtered = tables.filter(t => t.id !== id);
    setTables(filtered);
    if (selectedTableId === id) {
      setSelectedTableId(filtered[0].id);
    }
  };

  const addColumnToSelectedTable = () => {
    if (!selectedTable) return;
    const newCol: Column = {
      id: `col-${Date.now()}`,
      name: `field_${selectedTable.columns.length + 1}`,
      type: 'VARCHAR',
      isPrimary: false,
      isNullable: true,
      isForeignKey: false
    };

    setTables(tables.map(t => {
      if (t.id === selectedTable.id) {
        return { ...t, columns: [...t.columns, newCol] };
      }
      return t;
    }));
  };

  const updateColumn = (colId: string, fields: Partial<Column>) => {
    setTables(tables.map(t => {
      if (t.id === selectedTable.id) {
        return {
          ...t,
          columns: t.columns.map(c => c.id === colId ? { ...c, ...fields } : c)
        };
      }
      return t;
    }));
  };

  const deleteColumn = (colId: string) => {
    setTables(tables.map(t => {
      if (t.id === selectedTable.id) {
        return {
          ...t,
          columns: t.columns.filter(c => c.id !== colId)
        };
      }
      return t;
    }));
  };

  // SQL & Schema Code Generator
  const generateExportCode = (): string => {
    if (exportFormat === 'postgresql') {
      return tables.map(tbl => {
        const colsSql = tbl.columns.map(c => {
          let line = `  ${c.name} ${c.type === 'UUID' ? 'UUID' : c.type === 'VARCHAR' ? 'VARCHAR(255)' : c.type}`;
          if (c.isPrimary) line += ' PRIMARY KEY';
          if (!c.isNullable && !c.isPrimary) line += ' NOT NULL';
          if (c.isForeignKey && c.referencesTable) {
            line += ` REFERENCES ${c.referencesTable}(id) ON DELETE CASCADE`;
          }
          return line;
        }).join(',\n');
        return `CREATE TABLE ${tbl.name} (\n${colsSql}\n);`;
      }).join('\n\n');
    }

    if (exportFormat === 'mysql') {
      return tables.map(tbl => {
        const colsSql = tbl.columns.map(c => {
          let line = `  \`${c.name}\` ${c.type === 'UUID' ? 'VARCHAR(36)' : c.type === 'VARCHAR' ? 'VARCHAR(255)' : c.type}`;
          if (c.isPrimary) line += ' PRIMARY KEY';
          if (!c.isNullable && !c.isPrimary) line += ' NOT NULL';
          return line;
        }).join(',\n');
        return `CREATE TABLE \`${tbl.name}\` (\n${colsSql}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
      }).join('\n\n');
    }

    // Prisma ORM Format
    return tables.map(tbl => {
      const colsPrisma = tbl.columns.map(c => {
        let pType = c.type === 'UUID' ? 'String' : c.type === 'VARCHAR' ? 'String' : c.type === 'INTEGER' ? 'Int' : c.type === 'BOOLEAN' ? 'Boolean' : c.type === 'TIMESTAMP' ? 'DateTime' : 'String';
        let attr = '';
        if (c.isPrimary) attr += ' @id @default(uuid())';
        if (c.isNullable && !c.isPrimary) pType += '?';
        return `  ${c.name} ${pType}${attr}`;
      }).join('\n');
      return `model ${tbl.name.charAt(0).toUpperCase() + tbl.name.slice(1)} {\n${colsPrisma}\n}`;
    }).join('\n\n');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-950 p-6 md:p-10 border border-cyan-500/30 shadow-2xl shadow-cyan-500/5">
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Database className="w-7 h-7 text-slate-950" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
                    {isAr ? 'مصمم ومصمّم قواعد البيانات والعلاقات' : 'Interactive ERD & Database Schema Studio'}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {isAr ? 'تصميم الجداول، العلاقات، واستخراج SQL & Prisma' : 'Visual Table Architect & SQL DDL Code Generator'}
                  </h1>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {isAr 
                  ? 'صمم هيكلية قواعد البيانات، أضف المفاتيح الأساسية والأجنبية (Primary & Foreign Keys)، وشاهد العلاقات بشكل تفاعلي واستخرج أكواد SQL لقواعد PostgreSQL, MySQL, أو نماذج Prisma مباشرةً.'
                  : 'Design database entities, primary & foreign keys, set column constraints, and auto-generate clean SQL DDL & Prisma ORM schemas.'}
              </p>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
              {(['postgresql', 'mysql', 'prisma'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                    exportFormat === fmt 
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ERD Main Workbench Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Table Management & Column Editor (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Table Selector & New Table Form */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <TableIcon className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-extrabold text-sm text-white">
                    {isAr ? 'جداول قاعدة البيانات الحالية' : 'Database Tables Entity List'}
                  </h2>
                </div>

                {/* Add Table Controls */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="text"
                    placeholder={isAr ? 'اسم الجدول الجديد (مثلاً: products)...' : 'New Table Name...'}
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={addTable}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center space-x-1 rtl:space-x-reverse shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إضافة' : 'Add'}</span>
                  </button>
                </div>
              </div>

              {/* Table Tabs */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                {tables.map(tbl => {
                  const isSelected = tbl.id === selectedTableId;
                  return (
                    <div
                      key={tbl.id}
                      onClick={() => setSelectedTableId(tbl.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all flex items-center space-x-2 rtl:space-x-reverse border ${
                        isSelected 
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-sm' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>{tbl.name}</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-400">
                        {tbl.columns.length}
                      </span>
                      {tables.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTable(tbl.id);
                          }}
                          className="hover:text-red-400 text-slate-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Table Column Builder */}
            {selectedTable && (
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-extrabold text-sm text-white font-mono">
                      {isAr ? `تعديل الأعمدة لـ: ${selectedTable.name}` : `Columns Schema for: ${selectedTable.name}`}
                    </h3>
                  </div>

                  <button
                    onClick={addColumnToSelectedTable}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-bold text-xs transition-colors flex items-center space-x-1 rtl:space-x-reverse"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة عمود جديد' : 'Add Column'}</span>
                  </button>
                </div>

                {/* Column Table */}
                <div className="space-y-3">
                  {selectedTable.columns.map((col) => (
                    <div key={col.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse w-full md:w-auto">
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) => updateColumn(col.id, { name: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500 w-full md:w-36"
                        />
                        <select
                          value={col.type}
                          onChange={(e) => updateColumn(col.id, { type: e.target.value as any })}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                        >
                          <option value="UUID">UUID</option>
                          <option value="VARCHAR">VARCHAR</option>
                          <option value="INTEGER">INTEGER</option>
                          <option value="DECIMAL">DECIMAL</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                          <option value="TIMESTAMP">TIMESTAMP</option>
                          <option value="TEXT">TEXT</option>
                        </select>
                      </div>

                      {/* Constraints & Flags */}
                      <div className="flex items-center space-x-3 rtl:space-x-reverse text-[11px] font-mono text-slate-400">
                        <label className="flex items-center space-x-1 rtl:space-x-reverse cursor-pointer">
                          <input
                            type="checkbox"
                            checked={col.isPrimary}
                            onChange={(e) => updateColumn(col.id, { isPrimary: e.target.checked })}
                            className="rounded accent-cyan-500"
                          />
                          <span className={col.isPrimary ? 'text-amber-400 font-bold' : ''}>PK</span>
                        </label>

                        <label className="flex items-center space-x-1 rtl:space-x-reverse cursor-pointer">
                          <input
                            type="checkbox"
                            checked={col.isNullable}
                            onChange={(e) => updateColumn(col.id, { isNullable: e.target.checked })}
                            className="rounded accent-cyan-500"
                          />
                          <span>Nullable</span>
                        </label>

                        <label className="flex items-center space-x-1 rtl:space-x-reverse cursor-pointer">
                          <input
                            type="checkbox"
                            checked={col.isForeignKey}
                            onChange={(e) => updateColumn(col.id, { isForeignKey: e.target.checked })}
                            className="rounded accent-cyan-500"
                          />
                          <span className={col.isForeignKey ? 'text-purple-400 font-bold' : ''}>FK</span>
                        </label>

                        {col.isForeignKey && (
                          <select
                            value={col.referencesTable || ''}
                            onChange={(e) => updateColumn(col.id, { referencesTable: e.target.value })}
                            className="bg-slate-900 border border-purple-500/40 rounded-lg px-2 py-0.5 text-purple-300 font-mono text-[10px]"
                          >
                            <option value="">Ref Table...</option>
                            {tables.filter(t => t.id !== selectedTable.id).map(t => (
                              <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        )}

                        <button
                          onClick={() => deleteColumn(col.id)}
                          className="text-slate-600 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Generated Code & ERD Output (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[520px]">
              <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Generated Schema ({exportFormat.toUpperCase()})
                  </span>
                </div>

                <button
                  onClick={copyCode}
                  className="flex items-center space-x-1.5 rtl:space-x-reverse text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 font-mono text-xs text-cyan-300 overflow-y-auto flex-1 leading-relaxed">
                <pre>{generateExportCode()}</pre>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
