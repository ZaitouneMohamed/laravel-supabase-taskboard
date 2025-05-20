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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

// Mock data - this would be replaced with API data later
const initialTasks = {
  'todo': [
    { id: 'task-1', content: 'Create new landing page', priority: 'medium' },
    { id: 'task-2', content: 'Update user authentication', priority: 'high' },
    { id: 'task-3', content: 'Design monthly newsletter', priority: 'low' },
  ],
  'in-progress': [
    { id: 'task-4', content: 'Optimize database queries', priority: 'high' },
    { id: 'task-5', content: 'Implement file upload feature', priority: 'medium' },
  ],
  'done': [
    { id: 'task-6', content: 'Fix navigation bug', priority: 'high' },
    { id: 'task-7', content: 'Add form validation', priority: 'medium' },
  ]
};

// Column definitions
const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-blue-100', icon: AlertCircle },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-100', icon: Clock },
  { id: 'done', title: 'Done', color: 'bg-green-100', icon: CheckCircle }
];

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const classes = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${classes[priority]}`}>
      {priority}
    </span>
  );
};

// Sortable task item component
const SortableTaskItem = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 mb-3 rounded shadow-sm border-l-4 ${
        task.priority === 'high' ? 'border-red-500' :
        task.priority === 'medium' ? 'border-blue-500' : 'border-green-500'
      } cursor-grab active:cursor-grabbing`}
    >
      <div className="font-medium mb-2">{task.content}</div>
      <div className="flex justify-between items-center">
        <PriorityBadge priority={task.priority} />
        <div className="text-xs text-gray-500">
          ID: {task.id}
        </div>
      </div>
    </div>
  );
};

// Droppable column component
const DroppableColumn = ({ column, tasks }) => {
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
          {tasks.length}
        </span>
      </div>

      {/* This is the droppable area */}
      <div
        ref={setNodeRef}
        className={`min-h-[300px] p-3 transition-all ${dropStyle}`}
      >
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <SortableTaskItem
              key={task.id}
              task={task}
            />
          ))}
        </SortableContext>

        {/* Show placeholder text for empty columns */}
        {tasks.length === 0 && (
          <div className="h-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-gray-400">Drop task here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main task board component
const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Increase activation constraint to prevent accidental drags
      activationConstraint: {
        distance: 10, // Require moving at least 10px before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find which column contains a task
  const findColumnForTask = (taskId) => {
    for (const [columnId, columnTasks] of Object.entries(tasks)) {
      if (columnTasks.find(task => task.id === taskId)) {
        return columnId;
      }
    }
    return null;
  };

  // This function would eventually be replaced with an API call
  const updateTaskStatus = (taskId, sourceColumn, destinationColumn) => {
    console.log(`Task ${taskId} moved from ${sourceColumn} to ${destinationColumn}`);
    // API call would go here:
    // const response = await fetch('/api/tasks/update-status', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     taskId,
    //     sourceColumn,
    //     destinationColumn
    //   })
    // });
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const taskId = active.id;
    const columnId = findColumnForTask(taskId);

    if (columnId) {
      const taskData = tasks[columnId].find(task => task.id === taskId);
      setActiveTask(taskData);
    }
  };

  const handleDragOver = (event) => {
    // Additional drag over logic could go here
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveTask(null);

    // If no valid drop target
    if (!over) return;

    const activeId = active.id;

    // Find source column
    const sourceColumnId = findColumnForTask(activeId);
    if (!sourceColumnId) return;

    // Extract column ID from the drop target
    // This works for both dropping on a column or on another task
    const overId = over.id;

    // Skip processing if dragged and dropped on the same task
    if (activeId === overId) {
      console.log("Dropped on the same task, no changes needed");
      return;
    }

    let destinationColumnId;

    if (String(overId).startsWith('column-')) {
      // Dropped directly on a column
      destinationColumnId = over.data.current.columnId;
    } else {
      // Dropped on a task, find its column
      destinationColumnId = findColumnForTask(overId);
    }

    if (!destinationColumnId) return;

    // Create a deep copy of the entire tasks state to avoid reference issues
    const newTasksState = JSON.parse(JSON.stringify(tasks));

    // Get task arrays for source and destination
    const sourceColumnTasks = newTasksState[sourceColumnId];
    const destinationColumnTasks = newTasksState[destinationColumnId];

    // Find the task to move
    const taskIndex = sourceColumnTasks.findIndex(task => task.id === activeId);
    if (taskIndex === -1) return;

    // Create a copy of the task to move
    const movedTask = {...sourceColumnTasks[taskIndex]};

    // Remove task from source column
    sourceColumnTasks.splice(taskIndex, 1);

    if (sourceColumnId === destinationColumnId) {
      // Reordering within the same column
      const overIndex = destinationColumnTasks.findIndex(task => task.id === overId);

      if (overIndex !== -1) {
        // Insert at the position of the task we dropped on
        destinationColumnTasks.splice(overIndex, 0, movedTask);
      } else {
        // Fallback to adding at the end
        destinationColumnTasks.push(movedTask);
      }
    } else {
      // Moving to a different column
      if (overId === `column-${destinationColumnId}`) {
        // Dropped directly on the column, add to end
        destinationColumnTasks.push(movedTask);
      } else {
        // Dropped on a task in another column
        const overIndex = destinationColumnTasks.findIndex(task => task.id === overId);

        if (overIndex !== -1) {
          // Insert at the position of the task we dropped on
          destinationColumnTasks.splice(overIndex, 0, movedTask);
        } else {
          // Fallback to adding at the end
          destinationColumnTasks.push(movedTask);
        }
      }

      // Log task status update (would be API call in production)
      updateTaskStatus(activeId, sourceColumnId, destinationColumnId);
    }

    // Update state with new task positions
    setTasks(newTasksState);
  };

  const handleClearColumn = (columnId) => {
    setTasks({
      ...tasks,
      [columnId]: [] // Clear the column
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
      {
          title: 'Dashboard',
          href: '/dashboard',
      },
  ];

  return (
     <AppLayout breadcrumbs={breadcrumbs}>

        <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Task Board</h1>

        <div className="mb-4 flex justify-end space-x-2">
            <button
            onClick={() => handleClearColumn('in-progress')}
            className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300 text-sm"
            >
            Clear "In Progress"
            </button>
            <button
            onClick={() => handleClearColumn('done')}
            className="px-3 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300 text-sm"
            >
            Clear "Done"
            </button>
        </div>

        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            measuring={{
            droppable: {
                strategy: MeasuringStrategy.Always
            }
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map(column => (
                <DroppableColumn
                key={column.id}
                column={column}
                tasks={tasks[column.id]}
                />
            ))}
            </div>

            {/* Overlay that follows the cursor during drag */}
            <DragOverlay>
            {activeTask ? (
                <div className={`bg-white p-3 rounded shadow-lg border-l-4 w-64 ${
                activeTask.priority === 'high' ? 'border-red-500' :
                activeTask.priority === 'medium' ? 'border-blue-500' : 'border-green-500'
                } opacity-90`}>
                <div className="font-medium mb-2">{activeTask.content}</div>
                <div className="flex justify-between items-center">
                    <PriorityBadge priority={activeTask.priority} />
                    <div className="text-xs text-gray-500">
                    ID: {activeTask.id}
                    </div>
                </div>
                </div>
            ) : null}
            </DragOverlay>
        </DndContext>

        {/* Debug info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <h3 className="font-bold mb-2">Column Status:</h3>
            <div className="grid grid-cols-3 gap-2">
            {columns.map(column => (
                <div key={column.id} className="p-2 bg-white rounded border">
                <div className="font-medium">{column.title}</div>
                <div>Tasks: {tasks[column.id].length}</div>
                <div className={tasks[column.id].length === 0 ? "text-orange-500 font-bold" : "text-green-500"}>
                    {tasks[column.id].length === 0 ? "Empty (Still Droppable)" : "Has Items"}
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
     </AppLayout>
  );
};

export default TaskBoard;
