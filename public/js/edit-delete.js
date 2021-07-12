const id = window.location.toString().split('/')[
  window.location.toString().split('/').length - 1
];

async function editFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('#title').value.trim();
  const content = document.querySelector('#content').value.trim();
    
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      content
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }

};

async function deleteFormHandler(event) {
  event.preventDefault();
    
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  });
  
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }
    
}

document.querySelector('#delete-btn').addEventListener('click', deleteFormHandler);

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);