document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the button
    document.getElementById('fetch-news').addEventListener('click', function () {
        // Get user input values
        const country = document.getElementById('country').value;
        const category = document.getElementById('category').value;

        // Fetch news based on user input
        fetch(`/news?country=${country}&category=${category}`)
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