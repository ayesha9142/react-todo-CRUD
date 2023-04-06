import React from "react";
import "antd/dist/reset.css";
import "./App.css";
import { Button, Table, Modal, Input } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const data = [];

function App() {
  const [searchedText, setSearchedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [dataSource, setDataSource] = useState(data);

    
  useEffect(() => {
    fetch("http://localhost:8000/data")
    .then(response => response.json())
    .then(data => {
      setDataSource(data)
    }).catch(err => {
      console.log(err)
    })
  }, [])


  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 2,
      },
    },
    {
      key: "1",
      title: "Timestamp",
      dataIndex: "Timestamp",
      sorter: {
        compare: (a, b) => a.Timestamp - b.Timestamp,
        multiple: 2,
      },
    },
    {
      key: "5",
      title: "Tag",
      dataIndex: "completed",
      filters: [
        {
          text: 'Completed',
          value: 'Completed',
        },
        {
          text: 'In Progress',
          value: 'In Progress',
        },
      ],
      onFilter: (value, record) => record.completed.indexOf(value) === 0,
    },
    {
      key: "2",
      title: "Title",
      dataIndex: "title",
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        value = value.toLowerCase();
        return record.title.toString().toLowerCase().includes(value);
      },
    },
    {
      key: "3",
      title: "Due Date:",
      dataIndex: "due",
      sorter: {
        compare: (a, b) => a.due - b.due,
        multiple: 2,
      },
    },
    {
      key: "4",
      title: "Description",
      dataIndex: "desc",
    },
    {
      key: "5",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditStudent(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStudent(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  
  const onDeleteStudent = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this student record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((student) => student.id !== record.id);
        });
      },
    });
  };
  const onEditStudent = (record) => {
    setIsEditing(true);
    setEditingStudent({ ...record });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };
  const onAddStudent = () => {
    const randomNumber = parseInt(Math.random() * 1000);
    const newTodo = {
      id: randomNumber,
      title: "Title " + randomNumber,
      due: randomNumber + "/23",
      desc: "Description " + randomNumber,
      completed: "Open",
      Timestamp: parseInt(Math.random() * 1000),
    };
    fetch('http://localhost:8000/data', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo)
    }).then(() => {
      console.log('new blog added');
    })
    setDataSource((pre) => {
      return [...pre, newTodo];
    });
  };
  
  
  

  return (
    <div className="App">
      <header className="App-header">
        <Input.Search
          placeholder="search here and tab search icon"
          style={{ padding: 20, width: "50%" }}
          onSearch={(value) => {
            setSearchedText(value);
          }}
          onChange={(e) => {
            setSearchedText(e.target.value);
          }}
        />
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 8, total: 50, showSizeChanger: true }}
        ></Table>
        <Button onClick={onAddStudent}>Add another field</Button>
        <Modal
          title="Edit Student"
          visible={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setDataSource((pre) => {
              return pre.map((student) => {
                if (student.id === editingStudent.id) {
                  return editingStudent;
                } else {
                  return student;
                }
              });
            });
            resetEditing();
          }}
        >
          <Input
            value={editingStudent?.title}
            onChange={(e) => {
              setEditingStudent((pre) => {
                return { ...pre, title: e.target.value };
              });
            }}
            required
          />
          <Input
            value={editingStudent?.due}
            onChange={(e) => {
              setEditingStudent((pre) => {
                return { ...pre, due: e.target.value };
              });
            }}
          />
          <Input
            value={editingStudent?.desc}
            onChange={(e) => {
              setEditingStudent((pre) => {
                return { ...pre, desc: e.target.value };
              });
            }}
          />
          <Input
            value={editingStudent?.completed}
            onChange={(e) => {
              setEditingStudent((pre) => {
                return { ...pre, completed: e.target.value };
              });
            }}
          />
        </Modal>
      </header>
    </div>
  );
}
export default App;
