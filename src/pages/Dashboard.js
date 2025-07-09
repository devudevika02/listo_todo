import React, { useState, useRef } from 'react';
import { FaSearch, FaPlus, FaTrash, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import './dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([
    { name: "WRITE", date: "2025-06-29", completed: false },
    { name: "STUDY", date: "2025-06-09", completed: true },
    { name: "HOMEWORK", date: "2025-07-01", completed: false },
    { name: "CLASSWORK", date: "2025-07-02", completed: true },
    { name: "ASSIGNMENT", date: "2025-07-10", completed: false },
  ]);

  const [filter, setFilter] = useState('All');

  const fileInputRefs = {
    json: useRef(),
    csv: useRef(),
    text: useRef(),
    xml: useRef(),
    sql: useRef()
  };

  const handleExport = (format) => {
    let data = '';

    switch (format) {
      case 'json':
        data = JSON.stringify(tasks, null, 2);
        break;
      case 'csv':
        data = 'Name,Date,Completed\n' + tasks.map(t => `${t.name},${t.date},${t.completed}`).join('\n');
        break;
      case 'text':
        data = tasks.map(t => `${t.name} - ${t.date} - ${t.completed ? 'Completed' : 'Pending'}`).join('\n');
        break;
      case 'xml':
        data = `<tasks>\n${tasks.map(t =>
          `  <task><name>${t.name}</name><date>${t.date}</date><completed>${t.completed}</completed></task>`
        ).join('\n')}\n</tasks>`;
        break;
      case 'sql':
        data = tasks.map(t =>
          `INSERT INTO tasks (name, date, completed) VALUES ('${t.name}', '${t.date}', ${t.completed});`
        ).join('\n');
        break;
      default:
        alert("Unsupported format");
        return;
    }

    const blob = new Blob([data], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tasks.${format}`;
    link.click();
  };

  const handleImport = (event, format) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      let newTasks = [];

      try {
        switch (format) {
          case 'json':
            newTasks = JSON.parse(content);
            break;
          case 'csv':
            const rows = content.split('\n').slice(1);
            newTasks = rows.map(row => {
              const [name, date, completed] = row.split(',');
              return { name, date, completed: completed === 'true' };
            });
            break;
          case 'text':
            newTasks = content.split('\n').map(line => {
              const [name, date, status] = line.split(' - ');
              return { name, date, completed: status.trim().toLowerCase() === 'completed' };
            });
            break;
          case 'xml':
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(content, 'text/xml');
            const xmlTasks = xmlDoc.getElementsByTagName('task');
            newTasks = Array.from(xmlTasks).map(taskNode => ({
              name: taskNode.getElementsByTagName('name')[0].textContent,
              date: taskNode.getElementsByTagName('date')[0].textContent,
              completed: taskNode.getElementsByTagName('completed')[0].textContent === 'true'
            }));
            break;
          case 'sql':
            const sqlLines = content.split('\n');
            newTasks = sqlLines.map(line => {
              const match = line.match(/VALUES\s\('(.+)',\s'(.+)',\s(.*?)\);/);
              return match ? { name: match[1], date: match[2], completed: match[3] === 'true' } : null;
            }).filter(Boolean);
            break;
          default:
            return;
        }

        setTasks(prev => [...prev, ...newTasks]);
        alert(`Imported ${newTasks.length} tasks from ${format.toUpperCase()}`);
      } catch (err) {
        alert('Error parsing file!');
      }

      fileInputRefs[format].current.value = '';
    };

    reader.readAsText(file);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return task.completed;
    if (filter === 'Pending') return !task.completed;
    return true;
  });

  return (
    <div className="dashboard-container bg-dark mt-5">
      <div className="dashboard-card" style={{ width: '500px', margin: 'auto', padding: '20px' }}>
        <h2 className="logo"><span className="check-icon">✔</span> Listö</h2>

        <div className="search-bar mb-3">
          <input type="text" placeholder="Search tasks by name..." className="form-control" />
        </div>

        <div className="controls d-flex justify-content-between mb-3">

          {/* Filter Dropdown */}
          <div className="dropdown">
            <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Filter: {filter}
            </button>
            <ul className="dropdown-menu">
              {['All', 'Completed', 'Pending'].map(option => (
                <li key={option}>
                  <button className="dropdown-item" onClick={() => setFilter(option)}>
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Export Dropdown */}
          <div className="dropdown">
            <button className="btn btn-outline-info dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Export
            </button>
            <ul className="dropdown-menu">
              {['json', 'csv', 'text', 'xml', 'sql'].map(format => (
                <li key={format}>
                  <button className="dropdown-item" onClick={() => handleExport(format)}>
                    {format.toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Import Dropdown */}
          <div className="dropdown">
            <button className="btn btn-outline-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Import
            </button>
            <ul className="dropdown-menu">
              {['json', 'csv', 'text', 'xml', 'sql'].map(format => (
                <li key={format}>
                  <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                    {format.toUpperCase()}
                    <input
                      ref={fileInputRefs[format]}
                      type="file"
                      accept=".json,.csv,.txt,.xml,.sql"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImport(e, format)}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
<div className="add-task-form mb-4">
  <div className="row g-2 align-items-center">
    <div className="col-md-5">
      <input
        type="text"
        placeholder="Add a new task"
        className="form-control"
      />
    </div>
    <div className="col-md-4">
      <input
        type="date"
        className="form-control"
      />
    </div>
    <div className="col-md-3">
      <button className="btn btn-info w-100">
        <FaPlus className="me-1" /> Add
      </button>
    </div>
  </div>
</div>


        <div className="task-list">
          {filteredTasks.map((task, index) => (
            <div className="task-item d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded" key={index}>
              <div>
                <span className="task-name fw-bold text-dark">{task.name}</span>
                <span className="task-date text-muted"><FaCalendarAlt /> {task.date}</span>
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2"><FaEdit /></button>
                <button className="btn btn-sm btn-danger"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
