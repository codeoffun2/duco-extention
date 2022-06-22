const button = document.querySelector('button');



    

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'black';
        input.style.color = 'white';
        input.style.transform = 'scale(0.7)';
    });




  
   
    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'white';
        input.style.color = 'black';
        input.style.transform = 'scale(1)';
    });


document.querySelector('form').addEventListener('submit', event => {
  

    const username = document.querySelector('#username').value;
    

    if (username) {
        
    } else {
        document.querySelector('#username').placeholder = "Enter an username.";

        document.querySelector('#username').style.backgroundColor = 'red';

        document.querySelector('#username').classList.add('white_placeholder');
   
    }
});
function username(username){  
		alert(username);
}  