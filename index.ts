//----------------------part A--------------------
class Storage<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(item: T): void {
    this.items = this.items.filter((i) => i !== item);
  }

  getAllItems(): T[] {
    return [...this.items];
  }
}

// ---------- User ----------
class User {
  protected id: number;
  public name: string;
  public email: string;
  private password: string;
  public phone: string;
  private _age!: number;

  // Aggregation: User has multiple Notebooks
  private notebooks: NoteBook[] = [];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.age = age;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60");
    }
    this._age = value;
  }

  getId(): number {
    return this.id;
  }

  displayInfo(): void {
    console.log(
      `ID: ${this.id}, Name: ${this.name}, Email: ${this.email}, Phone: ${this.phone}, Age: ${this.age}`
    );
  }

  addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }

  getNotebooks(): NoteBook[] {
    return [...this.notebooks];
  }
}

// ---------- Admin extends User ----------
class Admin extends User {

  manageNotes(notebook: NoteBook): void {
    console.log(`Admin ${this.name} is managing notebook: ${notebook.name}`);

    notebook.getNotes().forEach((note) => {
      console.log(`  - [${note.id}] ${note.title}: ${note.preview()}`);
    });
  }

  deleteAnyNote(notebook: NoteBook, noteId: number): void {
    notebook.removeNote(noteId);
    console.log(`Admin ${this.name} deleted note #${noteId}`);
  }
}

// ---------- Note ----------
class Note {
  public id: number;
  public title: string;
  public content: string;

  // Association: Note has a User as its author
  public userId: User;

  constructor(id: number, title: string, content: string, author: User) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = author;
  }

  preview(length: number = 20): string {
    return this.content.length > length
      ? this.content.substring(0, length) + "..."
      : this.content;
  }
}

// ---------- NoteBook ----------
class NoteBook {
  public id: number;
  public name: string;

  // Composition: NoteBook contains Notes
  private notes: Note[] = [];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  addNote(id: number, title: string, content: string, author: User): Note {
    const note = new Note(id, title, content, author);
    this.notes.push(note);
    return note;
  }

  removeNote(noteId: number): void {
    this.notes = this.notes.filter((n) => n.id !== noteId);
  }

  getNotes(): Note[] {
    return [...this.notes];
  }
}

// ---------- Testing ----------

// Create Users
const user1 = new User(
  1,
  "Ahmed",
  "ahmed@gmail.com",
  "1234",
  "01012345678",
  25
);

const admin1 = new Admin(
  2,
  "Malak",
  "Malak@gmail.com",
  "admin123",
  "01098765432",
  30
);

// Display User Information
user1.displayInfo();
admin1.displayInfo();

// Create Notebook
const notebook1 = new NoteBook(1, "Study Notes");

// Aggregation: Add Notebook to User
user1.addNotebook(notebook1);

// Add Notes to Notebook
const note1 = notebook1.addNote(
  1,
  "TypeScript",
  "TypeScript is a typed superset of JavaScript",
  user1
);

notebook1.addNote(
  2,
  "OOP",
  "Inheritance, Encapsulation, Polymorphism, Abstraction",
  user1
);

// Display Note Preview
console.log("Preview:", note1.preview());

// Display Note Author
console.log("Note author:", note1.userId.name);

// Admin manages Notes
admin1.manageNotes(notebook1);

// Admin deletes a Note
admin1.deleteAnyNote(notebook1, 2);

// Display Notes after deletion
admin1.manageNotes(notebook1);

// Test Storage with Numbers
const numbersStorage = new Storage<number>();

numbersStorage.addItem(10);
numbersStorage.addItem(20);
numbersStorage.removeItem(10);

console.log("Numbers:", numbersStorage.getAllItems());

// Test Storage with Notes
const notesStorage = new Storage<Note>();

notesStorage.addItem(note1);

console.log("Notes in storage:", notesStorage.getAllItems().length);

// Test Age Validation
try {
  new User(3, "omar", "omar@gmail.com", "000", "010", 10);
} catch (e) {
  console.log("Error:", (e as Error).message);
}

export {};


//----------------------part B--------------------
/*
classDiagram
    class User {
        #number id
        +string name
        +string email
        -string password
        +string phone
        -number age
        +displayInfo() void
        +addNotebook(notebook) void
        +getNotebooks() NoteBook[]
        +getId() number
    }

    class Admin {
        +manageNotes(notebook) void
        +deleteAnyNote(notebook, noteId) void
    }

    class Note {
        +number id
        +string title
        +string content
        +number userId
        +User author
        +preview(length) string
    }

    class NoteBook {
        +number id
        +string name
        -Note[] notes
        +addNote(id, title, content, author) Note
        +removeNote(noteId) void
        +getNotes() Note[]
    }

    class Storage~T~ {
        -T[] items
        +addItem(item) void
        +removeItem(item) void
        +getAllItems() T[]
    }

    User <|-- Admin : Inheritance
    NoteBook "1" *-- "0..*" Note : Composition
    User "1" o-- "0..*" NoteBook : Aggregation
    Note "0..*" --> "1" User : Association
*/