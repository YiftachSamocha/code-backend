export function createData(type) {
    let blockToInsert = { type }
    switch (type) {
        case 'async':
            blockToInsert.content = asyncStarter
            blockToInsert.challenge = asyncChallenge
            blockToInsert.solution = asyncSolution
            blockToInsert.starter = asyncStarter
            blockToInsert.title = 'Async case'
            blockToInsert.subtitle = 'Fetch User Comments'
            break

        case 'dom':
            blockToInsert.content = domStarter
            blockToInsert.solution = domSolution
            blockToInsert.challenge = domChallenge
            blockToInsert.starter = domStarter
            blockToInsert.title = 'DOM manipulation'
            blockToInsert.subtitle = 'Highlight Even Items'
            break
        case 'array':
            blockToInsert.challenge = arrayChallenge
            blockToInsert.content = arrayStarter
            blockToInsert.starter = arrayStarter
            blockToInsert.solution = arraySolution
            blockToInsert.title = 'Array methods'
            blockToInsert.subtitle = 'Group By Property'
            break
        case 'event':
            blockToInsert.challenge = eventChallenge
            blockToInsert.content = eventStarter
            blockToInsert.solution = eventSolution
            blockToInsert.starter = eventStarter
            blockToInsert.title = 'Event loop'
            blockToInsert.subtitle = 'Simulate a Timer'
            break
        case 'error':
            blockToInsert.challenge = errorChallenge
            blockToInsert.content = errorStarter
            blockToInsert.starter = errorStarter
            blockToInsert.solution = errorSolution
            blockToInsert.title = 'Error handeling'
            blockToInsert.subtitle = 'Fetch User Data with Error Handling'
            break
        case 'data':
            blockToInsert.content = dataStarter
            blockToInsert.starter= dataStarter
            blockToInsert.challenge= dataChallenge
            blockToInsert.solution= dataSolution
            blockToInsert.title= 'Data structures'
            blockToInsert.subtitle= 'Remove Duplicates from an Array Using Set'
            break
    }
    return blockToInsert
}
const asyncChallenge = `Fetch a list of users and their respective comments from APIs.
			For each user, return an object containing their name and the total number of comments they have.`
const asyncStarter = `const fetchUsers = async () =>[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const fetchComments = async (userId) => (userId === 1 ? ['A', 'B'] : ['X', 'Y', 'Z']);
          
// Your function
async function getUserComments() {
// Implement this function
     }

getUserComments().then(console.log);
// Expected: [{ name: 'Alice', commentCount: 2 }, { name: 'Bob', commentCount: 3 }]`
const asyncSolution = `async function getUserComments() {
    const users = await fetchUsers();
    return Promise.all(
        users.map(async (user) => {
            const comments = await fetchComments(user.id);
            return { name: user.name, commentCount: comments.length };
        })
    );
}

getUserComments().then(console.log);
// Output: [{ name: 'Alice', commentCount: 2 }, { name: 'Bob', commentCount: 3 }]`

const domChallenge = `Given a list of items in the DOM, write a function that highlights all the even-indexed items by changing their background color to lightblue.`
const domStarter = `<ul id="items">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    <li>Item 4</li>
    <li>Item 5</li>
</ul>
<script>
    // Your function
    function highlightEvenItems() {
        // Implement this function
    }

    highlightEvenItems();
</script>
`
const domSolution = `function highlightEvenItems() {
    const items = document.querySelectorAll('#items li');
    items.forEach((item, index) => {
        if (index % 2 !== 0) {
            item.style.backgroundColor = 'lightblue';
        }
    });
}

highlightEvenItems();
`
const arrayChallenge = `Given an array of objects, 
group the objects by a specific property, 
and return an object where the keys are the values of the property,
 and the values are arrays of objects that have that property value.`
const arrayStarter = `const users = [
    { name: 'Alice', city: 'New York' },
    { name: 'Bob', city: 'Los Angeles' },
    { name: 'Charlie', city: 'New York' },
    { name: 'Dave', city: 'Chicago' }
];

// Your function
function groupByProperty(arr, property) {
    // Implement this function
}

console.log(groupByProperty(users, 'city'));
// Expected Output: 
// {
//     'New York': [
//         { name: 'Alice', city: 'New York' },
//         { name: 'Charlie', city: 'New York' }
//     ],
//     'Los Angeles': [{ name: 'Bob', city: 'Los Angeles' }],
//     'Chicago': [{ name: 'Dave', city: 'Chicago' }]
// }`

const arraySolution = `function groupByProperty(arr, property) {
    return arr.reduce((acc, curr) => {
        const key = curr[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
    }, {});
}

console.log(groupByProperty(users, 'city'));
// Output:
// {
//     'New York': [
//         { name: 'Alice', city: 'New York' },
//         { name: 'Charlie', city: 'New York' }
//     ],
//     'Los Angeles': [{ name: 'Bob', city: 'Los Angeles' }],
//     'Chicago': [{ name: 'Dave', city: 'Chicago' }]
// }`

const eventChallenge = `You need to simulate a timer that prints "Tick" every second. After 5 seconds, stop the timer and print "Done". Use the event loop and asynchronous functions to achieve this.`
const eventStarter = `// Your function
function startTimer() {
    // Implement this function
}

startTimer();
`
const eventSolution = `function startTimer() {
    let count = 0;

    const intervalId = setInterval(() => {
        count++;
        console.log('Tick');

        if (count === 5) {
            // After 5 ticks, clear the interval and log 'Done'
            clearInterval(intervalId);
            console.log('Done');
        }
    }, 1000);
}

startTimer();
`
const errorChallenge = `You need to fetch user data from an API. If the fetch is successful, log the user’s name. If an error occurs (e.g., the user is not found), catch the error and display a custom error message.`
const errorStarter = `const fetchUser = async (userId) => {
    // Simulate a user fetch from an API
    if (userId === 1) {
        return { name: 'Alice' };
    } else {
        throw new Error('User not found');
    }
};

// Your function
async function getUserData(userId) {
    // Implement this function with error handling
}

getUserData(1);  // Expected: "User: Alice"
getUserData(2);  // Expected: "Error: User not found"
`

const errorSolution = `
async function getUserData(userId) {
    try {
        const user = await fetchUser(userId);
        console.log(\`User: \${user.name}\`);
    } catch (error) {
        console.log(\`Error: \${error.message}\`);
    }
}

getUserData(1);  // Output: "User: Alice"
getUserData(2);  // Output: "Error: User not found"
`

const dataChallenge= `You need to remove duplicates from an array using a Set and return the result as a new array.`
const dataStarter= `function removeDuplicates(arr) {
    // Implement this function using a Set
}

// Example usage:
console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5]));  // Expected: [1, 2, 3, 4, 5]
console.log(removeDuplicates([10, 20, 20, 30]));        // Expected: [10, 20, 30]
`
const dataSolution= `function removeDuplicates(arr) {
    return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5]));  // Output: [1, 2, 3, 4, 5]
console.log(removeDuplicates([10, 20, 20, 30]));        // Output: [10, 20, 30]
`
