// Fetch news data
document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the button
    document.getElementById('fetch-news').addEventListener('click', function () {
        // Get user input values
        const country = document.getElementById('country').value;
        const category = document.getElementById('category').value;

        // Fetch news based on user input
        fetch(`/posts?country=${country}&category=${category}`)
            .then(response => response.json())
            .then(data => {
                const newsContainer = document.getElementById('news-container');
                newsContainer.innerHTML = ''; // Clear previous results

                if (data.articles) {
                    data.articles.forEach(article => {
                        const articleDiv = document.createElement('div');
                        articleDiv.className = 'article';

                        const title = document.createElement('h2');
                        title.textContent = article.title;

                        const description = document.createElement('p');
                        description.textContent = article.description || 'No description available.';

                        articleDiv.appendChild(title);
                        articleDiv.appendChild(description);
                        newsContainer.appendChild(articleDiv);
                    });
                } else {
                    console.log('No articles found.');
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
            });
    });
});


// Submit a post
document.getElementById('submit').addEventListener('submit', function (event) {
    event.preventDefault();

    const postTitle = document.getElementById('post-title').value;
    const postContent = document.getElementById('post-content').value;

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: postTitle,
            content: postContent
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })

    .then(data => {
        
        // Success posting
        console.log('Success:', data);
        alert('Post submitted successfully!');

        // Display the submitted post dynamically
        const postsContainer = document.getElementById('posts-container');
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        const title = document.createElement('h2');
        title.textContent = data.title;

        const content = document.createElement('p');
        content.textContent = data.content;

        postDiv.appendChild(title);
        postDiv.appendChild(content);
        postsContainer.appendChild(postDiv);

        // Clear the form
        document.getElementById('submit').reset();
    })
    .catch(error => {
        console.error('Error submitting post:', error);
        alert('Error submitting post.');
    });
});


// Updating posts 
window.addEventListener('load', function() {
    fetch('/posts')
        .then(response => response.json())
        .then(data => {
            data.forEach(post => {
                displayPost(post);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
});


function displayPost(posts) {
    const postsContainer = document.getElementById('post-container');
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.dataset.id = post.id;

    const postTitle = document.createElement('h3');
    postTitle.id = `post-titla-${post.id}`;
    postTitle.textContent = post.title;
    postDiv.appendChild(postContent);

    const postContent = document.createElement('p');
    postContent.id = `post-content-$${post.id}`;
    postContent.textContent = post.content;
    postDiv.appendChild(postContent);

    const editButton = document.createElement('button');
    editButton.className = 'edit-post';
    editButton.dataset.id = post.id;
    editButton.textContent = 'Edit';
    postDiv.appendChild(editButton);

    const editForm = document.createElement('form');
    editForm.className = 'edit-form';
    editForm.dataset.id = post.id;
    editForm.style.display = 'none';

    const editTitleInput = document.createElement('input');
    editTitleInput.type = 'text';
    editTitleInput.id = `edit-title-${post.id}`;
    editTitleInput.value = post.title;
    editForm.appendChild(editTitleInput);

    const editContetnTextArea = document.createElement('textarea');
    editContetnTextArea.id = `edit-content-${post.id}`;
    editContetnTextArea.textContent = post.content;
    editForm.appendChild(editContetnTextArea);

    const saveButton = document.createElement('button')
    saveButton.type = 'submit';
    saveButton.textContent = 'Save Changes';
    editForm.appendChild(saveButton);

    postDiv.appendChild(editForm);

    postsContainer.appendChild(postDiv);

    editButton.addEventListener('click', function() {
        editForm.style.display = 'block';
    });

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedTitle = editTitleInput.value;
        const updatedContent = editContetnTextArea.value;

        fetch(`/posts/${post.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: updatedTitle,
                content: updatedContent
            })
        })

        .then(response => response.json())
        .then(data => {
            postTitle.textContent = updatedTitle;
            postContent.textContent = updatedContent;
            editForm.style.display = 'none';
        })
        .catch(error => console.error('Error updating post:', error));
    });
}
