const urlBase = 'http://domainexpansion.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = [];

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	// let tmp = {login:login,password:password};
	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if(userId < 1)
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister() 
{
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    document.getElementById("registrationResult").innerHTML = "";

    var hash = md5 (password);

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: hash
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                document.getElementById("registrationResult").innerHTML = "User already exists";
                return;
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("registrationResult").innerHTML = "User added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
		        window.location.href = "index.html";
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("registrationResult").innerHTML = err.message;
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = firstName + "'s Domain";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
    let firstname = document.getElementById("contactFirst").value;
    let lastname = document.getElementById("contactLast").value;
    let phonenumber = document.getElementById("contactNumber").value;
    let emailaddress = document.getElementById("contactEmail").value;

    let tmp = {
        firstName: firstname,
        lastName: lastname,
        phone: phonenumber,
        email: emailaddress,
        userId: userId
    };

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log("Contact added");
                document.getElementById("add-form").reset();

                loadContacts();
                restoreAfterAdd();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

// function loadContacts() {
//     let tmp = {
//         search: "",
//         userId: userId
//     };

//     let jsonPayload = JSON.stringify(tmp);

//     let url = urlBase + '/SearchContacts.' + extension;
//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

//     try {
//         xhr.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 200) {
//                 let jsonObject = JSON.parse(xhr.responseText);
//                 if (jsonObject.error) {
//                     console.log(jsonObject.error);
//                     return;
//                 }
//                 let text = "<table border='1'>"
//                 for (let i = 0; i < jsonObject.results.length; i++) {
//                     ids[i] = jsonObject.results[i].contactId
//                     text += "<tr id='row" + i + "'>"
//                     text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
//                     text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
//                     text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
//                     text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
//                     text += "<td class='contactButtons'>" +
//                         "<button type='button' id='edit_button" + i + "' class='editButton' onclick='showEditContact(" + jsonObject.results[i].FirstName + ", " + jsonObject.results[i].LastName + ", " + jsonObject.results[i].Email + ", " + jsonObject.results[i].Phone + ");'>" +"<span class='material-symbols-outlined'>edit</span>"+ "</button>" +
//                         "<button type='button' onclick='deleteContact(" + jsonObject.results[i].ContactId + ", row" + i + ")' class='deleteButton'>" +"Delete"+ "</button>" + "</td>";
//                     text += "<tr/>"
//                 }
//                 text += "</table>"
//                 document.getElementById("tableBody").innerHTML = text;
                
//             }
//         };
//         xhr.send(jsonPayload);
//     } catch (err) {
//         console.log(err.message);
//     }
// }

function loadContacts() {
    let searchValue = document.getElementById("search").value;
    let tmp = {
        search: searchValue,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                    text += "<td class='contactButtons'>" +
                         "<button type='button' id='edit_button" + i + "' class='editButton' onclick='showEditContact("+jsonObject.results[i].ContactId+")'>" +"<span class='material-symbols-outlined'>edit</span>"+ "</button>" +
                         "<button type='button' onclick='deleteContact(" + jsonObject.results[i].ContactId + ", row" + i + ")' class='deleteButton'>" +"<span class='material-symbols-outlined'>delete</span>"+ "</button>" + "</td>";
                     text += "<tr/>"
                     console.log(i);
                }
                text += "</table>"
                document.getElementById("tableBody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function showAddContact() {
    var add = document.getElementById("addContact");
    var contacts = document.getElementById("contactTable");
    var search = document.getElementById("search");
    
    add.style.display = "block";
    contacts.style.display = "none";
    search.style.display = "none";
    // if (add.style.display === "none") {
    //     add.style.display = "block";
    //     contacts.style.display = "none";
    // } else {
    //     add.style.display = "none";
    //     contacts.style.display = "block";
    //     contacts.style.display = "block";
    // }
}

function restoreAfterAdd() {
    var add = document.getElementById("addContact");
    var contacts = document.getElementById("contactTable");
    var search = document.getElementById("search");
    
    add.style.display = "none";
    contacts.style.display = "block";
    search.style.display = "block";
}   

// function deleteContact(contactId, rowId) {
//     let confirmation = confirm("Are you sure you want to delete this contact?");

//     if (confirmation) {
//         let row = document.getElementById(rowId);
//         if (row) {
//             row.parentNode.removeChild(row);
//         }

//         let tmp = {
//             userId: userId,
//             contactId: contactId,
//         };

//         let jsonPayload = JSON.stringify(tmp);

//         let url = urlBase + '/DeleteContacts.' + extension;

//         let xhr = new XMLHttpRequest();
//         xhr.open("POST", url, true);
//         xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

//         try {
//             xhr.onreadystatechange = function () {
//                 if (this.readyState == 4) {
//                     if (this.status == 200) {
//                         console.log("Contact has been deleted");
//                         console.log(contactId);
//                         console.log(rowId);
//                     } else {
//                         console.log("Error deleting contact");
//                     }
//                 }
//             };

//             xhr.send(jsonPayload);
//         } catch (err) {
//             console.log(err.message);
//         }
//     }
// }

function deleteContact(contactId, rowId) {
    let confirmation = confirm("Are you sure you want to delete this contact?");

    if (confirmation) {
        let row = document.getElementById(rowId);
        if (row) {
            row.parentNode.removeChild(row);
        }

        let tmp = {
            userId: userId,
            contactId: contactId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContacts.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", url, true); // Changed to DELETE method
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        console.log("Contact has been deleted");
                        loadContacts();
                    } else {
                        console.log("Error deleting contact");
                    }
                }
            };

            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }
    }
}

function showEditContact(contactId) {
    // document.getElementById("editContactFirst").value = firstName;
    // document.getElementById("editContactLast").value = lastName;
    // document.getElementById("editContactEmail").value = email;
    // document.getElementById("editContactNumber").value = phone;

    var contacts = document.getElementById("contactTable");
    var edit = document.getElementById("editContact");
    var search = document.getElementById("search");

    edit.style.display = "block";
    contacts.style.display = "none";
    search.style.display = "none";
    // if (edit.style.display === "none") {
    //     edit.style.display = "block";
    //     contacts.style.display = "none";
    // } else {
    //     edit.style.display = "none";
    //     contacts.style.display = "block";
    // }
    
    document.getElementById("editButton").addEventListener("click", function () {
        editContact(contactId);});
}

// function showEditContact(contactId, firstName, lastName, email, phone) {

//     console.log("showEditContact called with:", contactId, firstName, lastName, email, phone);
//     document.getElementById("editContactFirst").value = firstName;
//     document.getElementById("editContactLast").value = lastName;
//     document.getElementById("editContactEmail").value = email;
//     document.getElementById("editContactNumber").value = phone;

//     const editForm = document.getElementById("editContact");
//     editForm.style.display = "block";

//     document.getElementById("editButton").addEventListener("click", function () {
//         updateContact(contactId);
//     });
// }

function editContact(contactId) {
    const firstName = document.getElementById("editContactFirst").value;
    const lastName = document.getElementById("editContactLast").value;
    const email = document.getElementById("editContactEmail").value;
    const phone = document.getElementById("editContactNumber").value;

    const updatedContact = {
        contactId: contactId, // Pass the contactId
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        userId: userId
    };

    const jsonPayload = JSON.stringify(updatedContact);

    const url = urlBase + '/UpdateContact.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log("Contact updated successfully");
                loadContacts();
                restoreAfterEdit();

            } else {
                console.log("Contact update failed");
            }

            const editForm = document.getElementById("editContact");
            editForm.style.display = "none";
        }
    };

    xhr.send(jsonPayload);
}

function restoreAfterEdit() {
    var edit = document.getElementById("editContact");
    var contacts = document.getElementById("contactTable");
    var search = document.getElementById("search");
    
    edit.style.display = "none";
    contacts.style.display = "block";
    search.style.display = "block";
} 

function validSignUpForm(fName, lName, user, pass)
{
    var fNameErr = lNameErr = userErr = passErr = true;
    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }
    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }
    if (user == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        console.log("USERNAME IS VALID");
        userErr = false;
    }
    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        console.log("PASSWORD IS VALID");
        passErr = false;
    }
    if ((fNameErr || lNameErr || userErr || passErr) == true) {
        return false;
    }
    return true;
}
