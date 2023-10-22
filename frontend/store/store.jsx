import { create } from 'zustand';
import { produce } from 'immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Turn the set method into an immer proxy
const immer = (config) => (set, get, api) =>
  config(
    (fn) => {
      const state = typeof fn === 'function' ? fn : () => fn;
      set(produce(state));
    },
    get,
    api
  );

const zustandCreateStore = (children) => create(immer(children));

const storeStates = {
  todo: []
};

const storeMethods = (set, get) => ({
  init: async () => {
    try {
      // await AsyncStorage.clear();
      const todo = await AsyncStorage.getItem('TODO');
    //   console.log("To do in store ",todo);
      if (todo !== null) {

        set({ todo: JSON.parse(todo) });
      }
    } catch (error) {
      console.log("Error in saving to do in storeMethods")
    }
  },
  updateTodo: async (item) =>
    new Promise(async (resolve) => {
        // console.log("Item ",item);
        // console.log("To do",get().todo)
      const datePresent = get().todo.find((data) => {
        // console.log("Data date ",data.date);
        // console.log("Item date ",item.date);
        
        // console.log(data);

        if (data.date === item.date) {
        //   console.log("1");
          return true;
        }
        // console.log("2");
        return false;
      });

      if (datePresent) {
        // console.log("3");
        const updatedTodo = get().todo.map((data) => {
          if (datePresent.date === data.date) {
            // console.log("4");
            return { ...data, todoList: [...data.todoList, ...item.todoList] };
          }
        //   console.log("5");
          return data;
        });

        try {
          set({ todo: updatedTodo });
          await AsyncStorage.setItem('TODO', JSON.stringify(updatedTodo));
        } catch (error) {
          // Error saving data
        }
      } else {
        // console.log("6");
        const newTodo = [...get().todo, item];

        try {
          await AsyncStorage.setItem('TODO', JSON.stringify(newTodo));
        //   console.log("10 ",newTodo);
          set({ todo: newTodo });
        //   console.log("7: ",newTodo);
        //   console.log("8: ",todo)
          resolve();
          await AsyncStorage.setItem('TODO', JSON.stringify(newTodo));
        //   console.log("9: ",todo);
        } catch (error) {
          console.log("Error in saving data ", error);
          // Error saving data
        }
      }
    }),
  deleteTodo: () => {},
  updateSelectedTask: async (item) =>
    new Promise(async (resolve) => {
      const previousTodo = get().todo;
      const newTodo = previousTodo.map((data) => {
        if (item.date === data.date) {
          const previousTodoList = [...data.todoList];
          const newTodoList = previousTodoList.map((list) => {
            if (list.key === item.todo.key) {
              return item.todo;
            }
            return list;
          });
          return { ...data, todoList: newTodoList };
        }
        return data;
      });
      try {
        set({ todo: newTodo });
        resolve();
        await AsyncStorage.setItem('TODO', JSON.stringify(newTodo));
      } catch (error) {
        // Error saving data
      }
    }),
  deleteSelectedTask: async (item) =>
    new Promise(async (resolve) => {
      const previousTodo = get().todo;
      const newTodo = previousTodo.map((data) => {
        if (item.date === data.date) {
          const previousTodoList = [...data.todoList];
          const newTodoList = previousTodoList.filter((list) => {
            if (list.key === item.todo.key) {
              return false;
            }
            return true;
          });

          return { ...data, todoList: newTodoList };
        }
        return data;
      });
      const checkForEmpty = newTodo.filter((data) => {
        if (data.todoList.length === 0) {
          return false;
        }
        return true;
      });
      try {
        set({ todo: checkForEmpty });
        resolve();
        await AsyncStorage.setItem('TODO', JSON.stringify(checkForEmpty));
      } catch (error) {
        // Error saving data
      }
    })
});

const useStore = zustandCreateStore((set, get) => ({
  ...storeStates,
  ...storeMethods(set, get)
}));

export default useStore;
