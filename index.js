import fs from "fs/promises";

class Searcher {
    constructor (students_ll, teachers_ll) {
        this.students_ll = students_ll;
        this.teachers_ll = teachers_ll;
    }

    find_classroom_by_student_surname (surname) {
        const start_time = process.hrtime();
        surname = surname.toUpperCase();
        
        let current_node = this.students_ll.head;
        while (current_node) {
            if (current_node.data.st_last_name === surname)
                console.log(`${current_node.data.st_last_name} ${current_node.data.st_first_name} - ${current_node.data.classroom}`);

            current_node = current_node.next;
        }

        const [seconds, nanoseconds] = process.hrtime(start_time);
        console.log(`\nRequest took: ${ seconds * 1000 + nanoseconds / 1e6 }ms`);
        console.log("\n\n");
    }

    find_bus_route_by_student_surname (surname) {
        const start_time = process.hrtime();
        surname = surname.toUpperCase();
        
        let current_node = this.students_ll.head;
        while (current_node) {
            if (current_node.data.st_last_name === surname)
                console.log(`${current_node.data.st_last_name} ${current_node.data.st_first_name} - ${current_node.data.bus}`);

            current_node = current_node.next;
        }

        const [seconds, nanoseconds] = process.hrtime(start_time);
        console.log(`\nRequest took: ${ seconds * 1000 + nanoseconds / 1e6 }ms`);
        console.log("\n\n");
    }

    find_teachers_by_classroom (classroom) {
        const start_time = process.hrtime();
        
        let current_node = this.teachers_ll.head;
        while (current_node) {
            if (current_node.data.classroom === classroom) 
                console.log(`${current_node.data.t_last_name} ${current_node.data.t_first_name} - ${current_node.data.classroom}`);
            current_node = current_node.next;
        }

        const [seconds, nanoseconds] = process.hrtime(start_time);
        console.log(`\nRequest took: ${ seconds * 1000 + nanoseconds / 1e6 }ms`);
        console.log("\n\n");
    }

    find_students_by_bus_route (bus_route) {
        const start_time = process.hrtime();
        let current_node = this.students_ll.head;
        while (current_node) {
            if (current_node.data.bus === bus_route)
                console.log(`${current_node.data.st_last_name} ${current_node.data.st_first_name} - ${current_node.data.bus}`);

            current_node = current_node.next;
        }

        const [seconds, nanoseconds] = process.hrtime(start_time);
        console.log(`\nRequest took: ${ seconds * 1000 + nanoseconds / 1e6 }ms`);
        console.log("\n\n");
    }

    find_students_by_grade (grade) {
        const start_time = process.hrtime();
        let current_node = this.students_ll.head;
        while (current_node) {
            if (current_node.data.grade === grade)
                console.log(`${current_node.data.st_last_name} ${current_node.data.st_first_name} - ${current_node.data.grade}`);

            current_node = current_node.next;
        }

        const [seconds, nanoseconds] = process.hrtime(start_time);
        console.log(`\nRequest took: ${ seconds * 1000 + nanoseconds / 1e6 }ms`);
        console.log("\n\n");
    }
}

class StudentNode {
    constructor (st_last_name, st_first_name, grade, classroom, bus) {
        this.next = null;
        this.data = {
            st_last_name,
            st_first_name,
            grade,
            classroom,
            bus
        };
    }
}

class TeacherNode {
    constructor (t_last_name, t_first_name, classroom) {
        this.next = null;
        this.data = {
            t_last_name,
            t_first_name,
            classroom,
        };
    }
}

class StudentsLinkedList {
    constructor () { 
        this.head = null;
        this.tail = null;
        this.length = 0; 
    }

    append (st_last_name, st_first_name, grade, classroom, bus) {
        const new_node = new StudentNode(
            st_last_name.trim(), 
            st_first_name.trim(), 
            grade.trim(), 
            classroom.trim(), 
            bus.trim()
        );

        if (!this.head) { this.head = new_node; } 
        else { this.tail.next = new_node; }

        new_node.next = null;
        this.tail = new_node;
        this.length++;

        return this;
    }
}

class TeachersLinkedList {
    constructor () { 
        this.head = null;
        this.tail = null;
        this.length = 0; 
    }

    append (t_last_name, t_first_name, classroom) {
        const new_node = new TeacherNode(
            t_last_name.trim(), 
            t_first_name.trim(), 
            classroom.trim()
        );

        if (!this.head) { this.head = new_node; } 
        else { this.tail.next = new_node; }

        new_node.next = null;
        this.tail = new_node;
        this.length++;

        return this;
    }
}

const get_user_input = (prompt) => {
    return new Promise((resolve) => {
        process.stdout.write(prompt);
        process.stdin.once("data", data => resolve(data.toString().trim()));
    });
}

function validate_user_input (input, min, max) {
    const value = Number(input);
    return !isNaN(value) && value >= min && value <= max;
}

(async () => {
    const STUDENTS_FILE_PATH = "./list.txt";
    const TEACHERS_FILE_PATH = "./teachers.txt";

    try {
        try { await fs.access(STUDENTS_FILE_PATH); }
        catch (error) { throw new Error("File list.txt not found"); } 

        try { await fs.access(TEACHERS_FILE_PATH); }
        catch (error) { throw new Error("File teachers.txt not found"); } 

        const students_file_content = await fs.readFile(STUDENTS_FILE_PATH, "utf-8");
        const students_lines = students_file_content
            .split("\n")
            .map(line => line.replace("\r", ""));

        const teachers_file_content = await fs.readFile(TEACHERS_FILE_PATH, "utf-8");
        const teachers_lines = teachers_file_content
            .split("\n")
            .map(line => line.replace("\r", ""));

        const students_ll = new StudentsLinkedList();
        const teachers_ll = new TeachersLinkedList();

        const searcher = new Searcher(students_ll, teachers_ll);

        students_lines.forEach(line => {
            if (line.trim()) {
                const line_content = line.split(",");
                students_ll.append(
                    line_content[0],
                    line_content[1],
                    line_content[2],
                    line_content[3],
                    line_content[4]
                );
            }    
        });

        teachers_lines.forEach(line => {
            if (line.trim()) {
                const line_content = line.split(",");
                teachers_ll.append(
                    line_content[0],
                    line_content[1],
                    line_content[2]
                );
            }    
        });

        while (true) {
            const user_input = await get_user_input("1. Find a student's classroom by surname\n2. Find a student's bus route by surname\n3. Find teachers by classroom\n4. Find students by their bus route\n5. Find students by their grade\n6. exit\n\n[option]: ");
            if (!validate_user_input(user_input, 1, 6)) throw new Error("Invalid user input");

            let user_details_input;
            switch (parseInt(user_input)) {
                case 1: 
                    user_details_input = await get_user_input("[student's surname]: ");
                    console.log("\n");

                    searcher.find_classroom_by_student_surname(user_details_input);
                    break;
                case 2:
                    user_details_input = await get_user_input("[student's surname]: ");
                    console.log("\n");

                    searcher.find_bus_route_by_student_surname(user_details_input);
                    break;
                case 3:
                    user_details_input = await get_user_input("[classroom]: ");
                    console.log("\n");

                    searcher.find_teachers_by_classroom(user_details_input);
                    break;
                case 4:
                    user_details_input = await get_user_input("[bus route]: ");
                    console.log("\n");

                    searcher.find_students_by_bus_route(user_details_input);
                    break;
                case 5:
                    user_details_input = await get_user_input("[grade]: ");
                    console.log("\n");

                    searcher.find_students_by_grade(user_details_input);
                    break;
                case 6:
                    process.exit(0);
            }
        }
    } catch (error) { 
        console.log(`An error occurred: ${ error.message }`); 
        process.exit(0);
    }
})();