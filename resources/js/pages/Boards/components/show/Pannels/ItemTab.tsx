import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  MeasuringStrategy
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, CheckCircle, AlertCircle, Plus, X, Check, ChevronDown, ChevronRight, ListTodo, CheckCircle2 } from 'lucide-react';
import { router, useForm } from '@inertiajs/react';

// Column definitions
const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-blue-100', icon: AlertCircle },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-100', icon: Clock },
  { id: 'done', title: 'Done', color: 'bg-green-100', icon: CheckCircle }
];

// Priority badge component
const PriorityBadge = ({ priority }) => {
    const classes = {
        'Low': 'bg-green-100 text-green-800',
        'Medium': 'bg-blue-100 text-blue-800',
        'High': 'bg-red-100 text-red-800',
        'Urgent': 'bg-purple-100 text-purple-800'
    };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${classes[priority]}`}>
      {priority}
    </span>
  );
};

// Task/Subtask component
const TaskItem = ({ task, onToggle, onDelete , hasPermission}) => {
    const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      router.put(route('task.update', task.id), {
        title: editedTitle
      }, {
        preserveState: false,
      });
    }
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className="flex items-center gap-2 py-1 text-sm">
      <div className="flex-shrink-0">
      {hasPermission ? (
          <>
            {task.completed ? (
              <CheckCircle2
                className="w-4 h-4 text-green-500 cursor-pointer"
                onClick={() => onToggle(task.id)}
              />
            ) : (
              <div
                className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => onToggle(task.id)}
              />
            )}
          </>
        ) : (
          <></>
        )}
      </div>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <span
          className={`flex-1 ${task.completed ? 'text-green-700' : 'text-gray-700'} ${hasPermission ? 'cursor-pointer hover:text-blue-600' : ''}`}
          onClick={() => hasPermission && setIsEditing(true)}
        >
          {task.title}
        </span>
      )}
      {hasPermission && !isEditing ? (
        <button onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
         <X className="w-3 h-3" />
         </button>
          ) : null}


    </div>
  );
};

// Inline task creator component
const InlineTaskCreator = ({ onCreateTask, onCancel }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = () => {
    if (taskTitle.trim()) {
      onCreateTask(taskTitle.trim());
      setTaskTitle('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded border">
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter task title..."
        className="w-full p-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />
      <div className="flex justify-end gap-1 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-3 h-3 mr-1" />
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!taskTitle.trim()}
          className="flex items-center px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Check className="w-3 h-3 mr-1" />
          Add
        </button>
      </div>
    </div>
  );
};

// Sortable board item component with tasks
const SortableBoardItem = ({ item, onCreateTask, onToggleTask, onDeleteTask }) => {
  const [showTasks, setShowTasks] = useState(false);
  const [showTaskCreator, setShowTaskCreator] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const tasks = item.tasks || [];
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  // Calculate progress based on completed tasks
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCreateTask = (taskTitle) => {
    onCreateTask(item.id, taskTitle);
    setShowTaskCreator(false);
  };

  const handleCancelTaskCreator = () => {
    setShowTaskCreator(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-3 mb-3 rounded shadow-sm border-l-4 ${
        item.priority === 'Urgent' ? 'border-purple-500' :
        item.priority === 'High' ? 'border-red-500' :
        item.priority === 'Medium' ? 'border-blue-500' : 'border-green-500'
      }`}
    >
      {/* Main board item header - draggable area */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="font-medium mb-2">{item.content}</div>

        {/* Progress Bar - only show if there are tasks */}
        {totalTasks > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs font-medium text-gray-700">
                {(() => {
                  let emoji = '';
                  if (progress >= 0 && progress < 20) {
                    emoji = '😟'; // Worried face for low progress
                  } else if (progress >= 20 && progress <= 80) {
                    emoji = '😐'; // Neutral face for medium progress
                  } else if (progress > 80) {
                    emoji = '😊'; // Happy face for high progress
                  }
                  return `${emoji} ${progress}%`;
                })()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ease-in-out ${(() => {
                  if (progress >= 0 && progress < 20) {
                    return 'bg-red-500'; // Red for 0-19%
                  } else if (progress >= 20 && progress <= 80) {
                    return 'bg-blue-600'; // Blue for 20-80%
                  } else {
                    return 'bg-green-500'; // Green for 81-100%
                  }
                })()}`}
                style={{
                  width: `${progress}%`
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <PriorityBadge priority={item.priority} />
          <div className="text-xs text-gray-500">
            By: {item.creator.name}
          </div>
        </div>
      </div>

      {/* Tasks section - not draggable */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          {totalTasks > 0 ? (
            <button
              onClick={() => setShowTasks(!showTasks)}
              className="flex items-center text-xs text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showTasks ? (
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1" />
              )}
              Tasks ({completedTasks}/{totalTasks})
            </button>
          ) : (
            <div className="flex items-center text-xs text-gray-400">
              <ListTodo className="w-3 h-3 mr-1" />
              No tasks assigned
            </div>
          )}


          {item.canAddTask ? (
            <button
                onClick={() => setShowTaskCreator(true)}
                className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
                <Plus className="w-3 h-3 mr-1" />
                Add task
            </button>

            ):(
                <></>

            )}
        </div>

        {/* Show tasks if they exist and are expanded */}
        {totalTasks > 0 && showTasks && (
          <div className="space-y-1">
            {tasks.map(task => (
              <TaskItem
                hasPermission={item.canAddTask}
                key={task.id}
                task={task}
                onToggle={(taskId) => onToggleTask(taskId)}
                onDelete={(taskId) => onDeleteTask(taskId)}
              />
            ))}
          </div>
        )}

        {/* Inline task creator */}
        {showTaskCreator && (
          <InlineTaskCreator
            onCreateTask={handleCreateTask}
            onCancel={handleCancelTaskCreator}
          />
        )}
      </div>
    </div>
  );
};

// Droppable column component
const DroppableColumn = ({ column, items = [], onCreateTask, onToggleTask, onDeleteTask }) => {
  // Use the useDroppable hook to make the column a drop target
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: 'column',
      columnId: column.id
    }
  });

  // Add highlighting when dragging over
  const dropStyle = isOver
    ? 'bg-opacity-70 ring-2 ring-blue-400'
    : '';

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${column.color}`}>
      <div className="p-4 font-bold flex items-center border-b border-gray-200">
        <column.icon className="mr-2 h-5 w-5" />
        <h2>{column.title}</h2>
        <span className="ml-auto bg-white rounded-full px-2 py-1 text-sm">
          {items.length}
        </span>
      </div>

      {/* This is the droppable area */}
      <div
        ref={setNodeRef}
        className={`min-h-[300px] p-3 transition-all ${dropStyle}`}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <SortableBoardItem
              key={item.id}
              item={item}
              onCreateTask={onCreateTask}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>

        {/* Show placeholder text for empty columns */}
        {items.length === 0 && (
          <div className="h-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-gray-400">Drop item here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Sample data matching your Laravel API structure
const sampleData = {
  "todo": [
    {
      "id": "1",
      "content": "title here",
      "description": null,
      "status": "todo",
      "priority": "Medium",
      "creator": {
        "id": 1,
        "name": "Scottie Fritsch"
      },
      "tasks": [
        {
          "id": 1,
          "board_item_id": 1,
          "title": "subtask here",
          "completed": true,
          "created_at": "2025-05-23T15:04:03.000000Z",
          "updated_at": "2025-05-23T15:04:08.000000Z"
        }
      ]
    }
  ],
  "in-progress": [
    {
      "id": "4",
      "content": "aaaaa",
      "description": null,
      "status": "in-progress",
      "priority": "Medium",
      "creator": {
        "id": 1,
        "name": "Scottie Fritsch"
      },
      "tasks": []
    },
    {
      "id": "2",
      "content": "jajajaj",
      "description": null,
      "status": "in-progress",
      "priority": "Medium",
      "creator": {
        "id": 1,
        "name": "Scottie Fritsch"
      },
      "tasks": []
    }
  ],
  "done": [
    {
      "id": "6",
      "content": "ddddd",
      "description": null,
      "status": "done",
      "priority": "Urgent",
      "creator": {
        "id": 1,
        "name": "Scottie Fritsch"
      },
      "tasks": []
    },
    {
      "id": "5",
      "content": "555555",
      "description": null,
      "status": "done",
      "priority": "Medium",
      "creator": {
        "id": 1,
        "name": "Scottie Fritsch"
      },
      "tasks": []
    }
  ]
};

// Main board component
const ItemTab = ({ MainTasks = sampleData, boardSlug = '', canAddTasks = false }) => {
  const [items, setItems] = useState(MainTasks);
  const [activeItem, setActiveItem] = useState(null);

  // Use the sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find which column contains an item
  const findColumnForItem = (itemId) => {
    for (const [columnId, columnItems] of Object.entries(items)) {
      if (columnItems.find(item => item.id === itemId)) {
        return columnId;
      }
    }
    return null;
  };

const handleCreateTask = async (itemId, taskTitle) => {
  try {
    router.post(route('task.store'), {
      board_item_id: itemId,
      title: taskTitle,
    }, {
          preserveState: false,
    });
  } catch (error) {
    console.error('Error creating task:', error);
  }
};

  // Handle toggling task completion
  const handleToggleTask = async (taskId) => {
    try {
      router.put(route('task.toogleTask', taskId), {}, {
        preserveState: false,
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Handle deleting task
  const handleDeleteTask = async (taskId) => {
    try {
        router.delete(route('task.delete' , taskId) ,
        {
            preserveState: false,
        });
    } catch (error) {
        console.error('Error creating task:', error);
    }

  };

  const handleDragStart = (event) => {
    const { active } = event;
    const itemId = active.id;
    const columnId = findColumnForItem(itemId);

    if (columnId) {
      const itemData = items[columnId].find(item => item.id === itemId);
      setActiveItem(itemData);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveItem(null);

    if (!over) return;

    const activeId = active.id;
    const sourceColumnId = findColumnForItem(activeId);
    if (!sourceColumnId) return;

    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    let destinationColumnId;

    if (String(overId).startsWith('column-')) {
      destinationColumnId = over.data.current.columnId;
    } else {
      destinationColumnId = findColumnForItem(overId);
    }

    if (!destinationColumnId) return;

    const newItemsState = JSON.parse(JSON.stringify(items));
    const sourceColumnItems = newItemsState[sourceColumnId];
    const destinationColumnItems = newItemsState[destinationColumnId];

    const itemIndex = sourceColumnItems.findIndex(item => item.id === activeId);
    if (itemIndex === -1) return;

    const movedItem = {...sourceColumnItems[itemIndex]};
    sourceColumnItems.splice(itemIndex, 1);

    if (sourceColumnId === destinationColumnId) {
      const overIndex = destinationColumnItems.findIndex(item => item.id === overId);
      if (overIndex !== -1) {
        destinationColumnItems.splice(overIndex, 0, movedItem);
      } else {
        destinationColumnItems.push(movedItem);
      }
    } else {
      movedItem.status = destinationColumnId;

      if (overId === `column-${destinationColumnId}`) {
        destinationColumnItems.push(movedItem);
      } else {
        const overIndex = destinationColumnItems.findIndex(item => item.id === overId);
        if (overIndex !== -1) {
          destinationColumnItems.splice(overIndex, 0, movedItem);
        } else {
          destinationColumnItems.push(movedItem);
        }
      }
      // Make API call to update item status
      router.put(route('boardItem.switchBoardStatus', activeId), {
        status: destinationColumnId,
      }, {
        preserveState: false,
      });
    }

    setItems(newItemsState);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Task Board</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {columns.map(column => (
            <DroppableColumn
              key={column.id}
              column={column}
              items={items[column.id] || []}
              onCreateTask={handleCreateTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        {/* Overlay that follows the cursor during drag */}
        <DragOverlay>
          {activeItem ? (
            <div className={`bg-white p-3 rounded shadow-lg border-l-4 w-64 ${
              activeItem.priority === 'Urgent' ? 'border-purple-500' :
              activeItem.priority === 'High' ? 'border-red-500' :
              activeItem.priority === 'Medium' ? 'border-blue-500' : 'border-green-500'
            } opacity-90`}>
              <div className="font-medium mb-2">{activeItem.content}</div>
              <div className="flex justify-between items-center">
                <PriorityBadge priority={activeItem.priority} />
                <div className="text-xs text-gray-500">
                  By: {activeItem.creator.name}
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default ItemTab;
