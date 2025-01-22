import _ from "lodash";

import { Todo } from "@db/entities/Todo.entity";
import { Mapper } from "@typeDeclarations/common";
import { MappedTodo } from "@typeDeclarations/todo";

export class TodoMapper implements Mapper<Todo, MappedTodo> {
  private static instance: TodoMapper;

  static getInstance(): TodoMapper {
    if (!this.instance) {
      this.instance = new TodoMapper();
    }

    return this.instance;
  }

  map(data: Todo): MappedTodo {
    return _.omit(data, ["user"]);
  }
}
