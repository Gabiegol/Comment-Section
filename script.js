const commentForm = document.getElementById('commentForm');
const commentInput = document.getElementById('commentInput');
const commentList = document.getElementById('commentList');
const reactionButtons = document.querySelectorAll('.reaction-buttons button');

let comments = [];
let sortBy = 'latest';
let userReactions = {};

commentForm.addEventListener('submit', e => {
  e.preventDefault();
  addCommentHandler();
});

commentInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    addCommentHandler();
  }
});

function addCommentHandler() {
  const commentText = commentInput.value.trim();
  if (commentText !== '') {
    addComment(commentText);
    commentInput.value = '';
  }
}

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
  comments.unshift(comment);
  renderComments();
}

function deleteComment(index) {
  comments.splice(index, 1);
  renderComments();
}

function editComment(index) {
  const newText = prompt('Edit your comment:', comments[index].text);
  if (newText !== null) {
    comments[index].text = newText;
    renderComments();
  }
}

function reactToComment(index, reaction) {
  if (!userReactions[index]) {
    comments[index].reactions[reaction]++;
    userReactions[index] = true;
    renderComments();
  }
}

function sortCommentsByTimestamp() {
  comments.sort((a, b) => a.timestamp - b.timestamp);
  sortBy = 'earliest';
  renderComments();
}

function sortCommentsByReverseTimestamp() {
  comments.sort((a, b) => b.timestamp - a.timestamp);
  sortBy = 'latest';
  renderComments();
}

function renderComments() {
  commentList.innerHTML = '';

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

  highlightSortButton();
}

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

renderComments();
