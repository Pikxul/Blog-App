// DOM elements
const blogList = document.getElementById('blog-list');
const addBlogForm = document.getElementById('add-blog-form');
const updateBlogForm = document.getElementById('update-blog-form');
const deleteBlogForm = document.getElementById('delete-blog-form');

// Function to get blogs from localStorage
const getBlogsFromLocalStorage = () => {
  const blogs = localStorage.getItem('blogs');
  return blogs ? JSON.parse(blogs) : [];
};

// Function to save blogs to localStorage
const saveBlogsToLocalStorage = (blogs) => {
  localStorage.setItem('blogs', JSON.stringify(blogs));
};

// Function to render blog posts
const renderBlogs = () => {
  blogList.innerHTML = '';

  const blogs = getBlogsFromLocalStorage();
  blogs.forEach(blog => {
    const blogItem = document.createElement('div');
    blogItem.classList.add('blog-item');
    blogItem.dataset.id = blog.id;

    let mediaContent = '';
    if (blog.media) {
      if (blog.mediaType.startsWith('image')) {
        mediaContent = `<img src="${blog.media}" alt="Blog Media" style="max-width: 100%; height: auto;">`;
      } else if (blog.mediaType.startsWith('video')) {
        mediaContent = `<video controls style="max-width: 100%; height: auto;">
                          <source src="${blog.media}" type="${blog.mediaType}">
                        </video>`;
      }
    }

    blogItem.innerHTML = `
      <p>${blog.content}</p>
      ${mediaContent}
      <button class="remove-blog-item">Remove</button>
    `;
    blogList.appendChild(blogItem);
  });
};

// Load blogs from localStorage on page load
renderBlogs();

// Function to handle file input and convert it to base64
const handleFileInput = (file, callback) => {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result, file.type);
  reader.readAsDataURL(file);
};

// Handle Add Blog form submission
addBlogForm.addEventListener('submit', e => {
  e.preventDefault();

  const content = document.getElementById('blog-content').value;
  const mediaFile = document.getElementById('blog-media').files[0];

  const blogs = getBlogsFromLocalStorage();
  const newBlog = {
    id: blogs.length ? blogs[blogs.length - 1].id + 1 : 1,
    content: content,
    media: null,
    mediaType: null
  };

  if (mediaFile) {
    handleFileInput(mediaFile, (mediaBase64, mediaType) => {
      newBlog.media = mediaBase64;
      newBlog.mediaType = mediaType;
      blogs.push(newBlog);
      saveBlogsToLocalStorage(blogs);
      renderBlogs();
    });
  } else {
    blogs.push(newBlog);
    saveBlogsToLocalStorage(blogs);
    renderBlogs();
  }

  addBlogForm.reset();
});

// Handle Update Blog form submission
updateBlogForm.addEventListener('submit', e => {
  e.preventDefault();

  const id = parseInt(document.getElementById('update-blog-id').value, 10);
  const content = document.getElementById('update-blog-content').value;
  const mediaFile = document.getElementById('update-blog-media').files[0];

  const blogs = getBlogsFromLocalStorage();
  const blog = blogs.find(b => b.id === id);

  if (blog) {
    blog.content = content;

    if (mediaFile) {
      handleFileInput(mediaFile, (mediaBase64, mediaType) => {
        blog.media = mediaBase64;
        blog.mediaType = mediaType;
        saveBlogsToLocalStorage(blogs);
        renderBlogs();
      });
    } else {
      saveBlogsToLocalStorage(blogs);
      renderBlogs();
    }
  } else {
    alert('Blog not found');
  }

  updateBlogForm.reset();
});

// Handle Delete Blog form submission
deleteBlogForm.addEventListener('submit', e => {
  e.preventDefault();

  const id = parseInt(document.getElementById('delete-blog-id').value, 10);

  let blogs = getBlogsFromLocalStorage();
  blogs = blogs.filter(b => b.id !== id);
  saveBlogsToLocalStorage(blogs);

  deleteBlogForm.reset();
  renderBlogs();
});

// Handle Blog Item Removal via button
blogList.addEventListener('click', e => {
  if (e.target.classList.contains('remove-blog-item')) {
    const blogItem = e.target.closest('.blog-item');
    const id = parseInt(blogItem.dataset.id, 10);

    let blogs = getBlogsFromLocalStorage();
    blogs = blogs.filter(b => b.id !== id);
    saveBlogsToLocalStorage(blogs);

    blogItem.remove();
  }
});

// Navbar functionality to show/hide sections
document.getElementById('nav-add').addEventListener('click', () => {
  document.getElementById('section-add').style.display = 'block';
  document.getElementById('section-update').style.display = 'none';
  document.getElementById('section-delete').style.display = 'none';
});

document.getElementById('nav-update').addEventListener('click', () => {
  document.getElementById('section-add').style.display = 'none';
  document.getElementById('section-update').style.display = 'block';
  document.getElementById('section-delete').style.display = 'none';
});

document.getElementById('nav-delete').addEventListener('click', () => {
  document.getElementById('section-add').style.display = 'none';
  document.getElementById('section-update').style.display = 'none';
  document.getElementById('section-delete').style.display = 'block';
});
