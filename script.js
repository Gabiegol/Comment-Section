// Selecting elements from the DOM
const commentForm = document.getElementById('commentForm'); // Get the comment form element
const commentInput = document.getElementById('commentInput'); // Get the comment input element
const commentList = document.getElementById('commentList'); // Get the comment list element
const reactionButtons = document.querySelectorAll('.reaction-buttons button'); // Get all the reaction buttons

// Initialize variables
let comments = []; // Array to store comments
let sortBy = 'latest'; // Variable to store the current sorting order
let userReactions = {}; // Object to track user reactions to comments

// Event listeners

// Event listener for submitting the comment form
commentForm.addEventListener('submit', e => {
  e.preventDefault();
  addCommentHandler();
});

// Event listener for detecting Enter key press with Ctrl key to submit the comment
commentInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    addCommentHandler();
  }
});

// Function to handle adding a new comment
function addCommentHandler() {
  const commentText = commentInput.value.trim();
  if (commentText !== '') {
    addComment(commentText);
    commentInput.value = ''; // Clear the comment input field
    commentInput.placeholder = 'Write a comment...'; // Show the placeholder text
  }
}

// Function to add a new comment to the comments array
function addComment(text) {
  const comment = {
    text,
    timestamp: new Date(),
    reactions: {
      laughter: 0,
      sad: 0,
      anger: 0,
      like: 0,
      love: 0
    }
  };
  comments.unshift(comment); // Add the comment at the beginning of the comments array
  renderComments(); // Update the rendered comments on the page
}

// Function to delete a comment based on its index in the comments array
function deleteComment(index) {
  comments.splice(index, 1); // Remove the comment from the comments array
  renderComments(); // Update the rendered comments on the page
}

// Function to edit a comment based on its index in the comments array
function editComment(index) {
  const newText = prompt('Edit your comment:', comments[index].text);
  if (newText !== null) {
    comments[index].text = newText; // Update the comment text
    renderComments(); // Update the rendered comments on the page
  }
}

// Function to react to a comment based on its index in the comments array and the reaction type
function reactToComment(index, reaction) {
  if (!userReactions[index]) {
    comments[index].reactions[reaction]++; // Increment the reaction count for the selected comment
    userReactions[index] = true; // Track that the user has reacted to this comment
    renderComments(); // Update the rendered comments on the page
  }
}

// Function to sort comments by timestamp in ascending order
function sortCommentsByTimestamp() {
  comments.sort((a, b) => a.timestamp - b.timestamp); // Sort the comments array by timestamp
  sortBy = 'earliest'; // Update the sorting order variable
  renderComments(); // Update the rendered comments on the page
}

// Function to sort comments by timestamp in descending order
function sortCommentsByReverseTimestamp() {
  comments.sort((a, b) => b.timestamp - a.timestamp); // Sort the comments array by reverse timestamp
  sortBy = 'latest'; // Update the sorting order variable
  renderComments(); // Update the rendered comments on the page
}

// Function to render the comments on the page
function renderComments() {
  commentList.innerHTML = ''; // Clear the comment list before rendering

  // Loop through each comment and create the necessary HTML elements
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');

    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = comment.timestamp.toLocaleString();

    const commentText = document.createElement('p');
    commentText.classList.add('comment-text');
    commentText.textContent = comment.text;

    const commentActions = document.createElement('div');
    commentActions.classList.add('comment-actions');

    const reactionButtons = document.createElement('div');
    reactionButtons.classList.add('reaction-buttons');

    // Loop through each reaction type and create the reaction buttons
    for (const reaction in comment.reactions) {
      const reactionButton = document.createElement('button');
      reactionButton.innerHTML = getReactionEmoji(reaction) + ' ' + comment.reactions[reaction];
      reactionButton.addEventListener('click', () => reactToComment(i, reaction));
      reactionButtons.appendChild(reactionButton);
    }

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editComment(i));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteComment(i));

    commentActions.appendChild(reactionButtons);
    commentActions.appendChild(editButton);
    commentActions.appendChild(deleteButton);

    commentElement.appendChild(timestamp);
    commentElement.appendChild(commentText);
    commentElement.appendChild(commentActions);

    commentList.appendChild(commentElement);
  }

  highlightSortButton(); // Highlight the active sort button
}

// Function to highlight the active sort button based on the current sorting order
function highlightSortButton() {
  sortButtons.forEach(button => {
    button.classList.remove('active');
    if (
      (button.id === 'sortLatest' && sortBy === 'latest') ||
      (button.id === 'sortEarliest' && sortBy === 'earliest')
    ) {
      button.classList.add('active');
    }
  });
}

// Function to get the corresponding emoji for a reaction type
function getReactionEmoji(reaction) {
  switch (reaction) {
    case 'laughter':
      return '😂';
    case 'sad':
      return '😢';
    case 'anger':
      return '😡';
    case 'like':
      return '👍';
    case 'love':
      return '❤️';
    default:
      return '';
  }
}

renderComments(); // Initial rendering of comments on the page
