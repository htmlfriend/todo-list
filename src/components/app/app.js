import React, { Component } from "react";
import SearchPanel from "../search-panel";
import AppHeader from "../app-header";
import TodoList from "../todo-list";
import ItemStatusFilter from "../item-status-filter";
import "./app.css";
import ItemAddForm from "../item-add-form";

export default class App extends Component {
  maxId = 100;
  state = {
    items: [
      this.createTodoItem("Drink coffee"),
      this.createTodoItem("Build awesome App"),
      this.createTodoItem("Have a lunch")
    ],
    term: "",
    filter: "all" //["active", "all", "done"]
  };

  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    };
  }

  addItem = text => {
    const newItem = this.createTodoItem(text);
    this.setState(({ items }) => {
      const newArr = [...items, newItem];
      return {
        items: newArr
      };
    });
  };
  toggleProperty(arr, id, propName) {
    // update object
    const idx = arr.findIndex(el => el.id === id);
    const oldItem = arr[idx];
    const newItem = { ...oldItem, [propName]: !oldItem[propName] };
    // construct new array
    return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
  }

  deleteItem = id => {
    this.setState(({ items }) => {
      const idx = items.findIndex(el => el.id === id);
      const newArr = [...items.slice(0, idx), ...items.slice(idx + 1)];
      return {
        items: newArr
      };
    });
  };

  onToggleImportant = id => {
    this.setState(({ items }) => {
      return {
        items: this.toggleProperty(items, id, "important")
      };
    });
  };

  onToggleDone = id => {
    this.setState(({ items }) => {
      return {
        items: this.toggleProperty(items, id, "done")
      };
    });
  };

  search(items, term) {
    if (term.length === 0) {
      return items;
    }
    return items.filter(item => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }

  onSearchChange = term => {
    this.setState({ term });
  };

  filterItems(items, filter) {
    if (filter === "all") {
      return items;
    } else if (filter === "active") {
      return items.filter(item => !item.done);
    } else if (filter === "done") {
      return items.filter(item => item.done);
    } else {
      return items;
    }
  }

  onFilterChange= (filter)=> {
    this.setState({ filter });
  }

  render() {
    const { items, term, filter } = this.state;
    const visibleItems = this.filterItems(this.search(items, term), filter);
    const doneCount = items.filter(el => el.done).length;
    const todoCount = items.length - doneCount;
    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange={this.onSearchChange} />
          <ItemStatusFilter
            filter={filter}
            onFilterChange={this.onFilterChange}
          />
        </div>
        <TodoList
          items={visibleItems}
          onDeleted={this.deleteItem}
          onToggleDone={this.onToggleDone}
          onToggleImportant={this.onToggleImportant}
        />
        <ItemAddForm addItem={this.addItem} />
      </div>
    );
  }
}
