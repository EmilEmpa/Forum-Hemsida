const createPostButton = document.querySelector('.create-post-button');

let visible = false;

let forumData = JSON.parse(localStorage.getItem("forumData")) || [];

createPostButton.addEventListener('click', function () {
    if (visible) { return; }
    const popup = document.createElement('div');

    popup.classList.add('popup');
    popup.innerHTML =
        `<div class="container">
    <h3>Create a new thread</h3>
    <label for="title">Title:</label>
    <input type="text" id="title" maxlength="50">
    <label for="content">Content:</label>
    <textarea class="content" id="content" contenteditable></textarea>
    <button type="submit">Create</button>

    <button type="button" class="close-button">Close</button>

    </div> `;

    const closeButton = popup.querySelector('.close-button');

    closeButton.addEventListener('click', function () {
        document.body.removeChild(popup);
        visible = false;
    });

    const createButton = popup.querySelector('button[type="submit"]');

    createButton.addEventListener('click', function () {

        const titleInput = popup.querySelector('#title');
        const contentInput = popup.querySelector('#content');
        const thread = document.createElement('div');

        // Check that the content is no more than 800 characters
        if (contentInput.value.length > 800) {
            alert("Content must be no more than 800 characters.");
            return;
        }

        thread.classList.add('thread');
        thread.innerHTML =
            `<h2>${titleInput.value}</h2>
        <p>${contentInput.value}</p>
        <div class="comments-wrapper">
        <button class="show-comments-button">Show comments</button>
        <div class="comments-container"></div>
        <form class="comment-form" style="display: none;">
        <label for="comment">Leave a comment:</label>
        <textarea class="comment-txt" id="comment"></textarea>
        <button type="submit">Submit</button>
        </form>
        </div> `;




        const container = document.querySelector('.threads-container');

        container.insertBefore(thread, container.firstChild);
        const commentForm = thread.querySelector('.comment-form');
        const commentsWrapper = thread.querySelector('.comments-wrapper');
        const showCommentsButton = thread.querySelector('.show-comments-button');
        const commentsContainer = thread.querySelector('.comments-container');


        let showingComments = false;

        showCommentsButton.addEventListener('click', function () {

            showingComments = !showingComments;

            if (showingComments) {

                commentsWrapper.classList.add('showing-comments');
                commentForm.style = "display: block;";
                commentsContainer.style = "display: block;"
                showCommentsButton.textContent = "Hide comments";
            }

            else {
                commentsWrapper.classList.remove('showing-comments');
                commentForm.style = "display: none;"
                commentsContainer.style = "display: none;"
                showCommentsButton.textContent = "Show comments";
            }

        });

        commentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const commentInput = commentForm.querySelector('#comment');
            const commentText = commentInput.value.trim();
            if (!commentText) { return; }
            const comment = document.createElement('div');
            comment.classList.add('comment');
            comment.innerHTML = `
            <p>${commentText}</p> `;

            commentsContainer.appendChild(comment);
            commentInput.value = '';
        });

        visible = false;
        document.body.removeChild(popup);

    });
    document.body.appendChild(popup);
    visible = true;

});
// Populate threads from stored data
const container = document.querySelector(".threads-container");
forumData.forEach((threadData) => {
    const thread = document.createElement("div");
    thread.classList.add("thread");
    thread.innerHTML = `
    <h2>${threadData.title}</h2>
    <p>${threadData.content}</p>
    <div class="comments-wrapper">
      <button class="show-comments-button">Show comments</button>
      <div class="comments-container">
        ${threadData.comments
            .map((comment) => `<div class="comment"><p>${comment}</p></div>`)
            .join("")}
      </div>
      <form class="comment-form" style="display: none;">
        <label for="comment">Leave a comment:</label>
        <textarea class="comment-txt" id="comment"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  `;
    container.appendChild(thread);

    // Add event listeners to show/hide comments and submit comments
    const commentForm = thread.querySelector(".comment-form");
    const commentsWrapper = thread.querySelector(".comments-wrapper");
    const showCommentsButton = thread.querySelector(".show-comments-button");
    const commentsContainer = thread.querySelector(".comments-container");
    let showingComments = false;
    showCommentsButton.addEventListener("click", function () {
        showingComments = !showingComments;
        if (showingComments) {
            commentsWrapper.classList.add("showing-comments");
            commentForm.style = "display: block;";
            commentsContainer.style = "display: block;";
            showCommentsButton.textContent = "Hide comments";
        } else {
            commentsWrapper.classList.remove("showing-comments");
            commentForm.style = "display: none;";
            commentsContainer.style = "display: none;";
            showCommentsButton.textContent = "Show comments";
        }
    });
    commentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const commentInput = commentForm.querySelector("#comment");
        const commentText = commentInput.value.trim();
        if (!commentText) {
            return;
        }
        const comment = document.createElement("div");
        comment.classList.add("comment");
        comment.innerHTML = `
      <p>${commentText}</p>
    `;
        commentsContainer.appendChild(comment);
        commentInput.value = "";

        // Store new comment in forumData
        threadData.comments.push(commentText.split(`,`));
        localStorage.setItem("forumData", JSON.stringify(forumData));
    })
})