<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
	header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

        $inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];
	$existingPassword = "";

        $conn = new mysqli("localhost", "domain", "expansion", "COP4331");

	
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }

	elseif ($firstName == "" || $login == "" || $password == "")
	{
		returnWithError("Please fill in the required field");
	}
	
	elseif (userExists($conn, $login, $existingPassword))
	{
		http_response_code(409);
		returnWithError("Username already exists with password: $existingPassword");
	}

        else
        {
		$stmt = $conn->prepare("INSERT into User (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
		$stmt->execute();
		$stmt->close();
		$conn->close();

		http_response_code(200);
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function userExists($conn, $login, &$existingPass)
	{
		$stmt = $conn->prepare("select * from User where login like ?");
		$stmt->bind_param("s", $login);
		$stmt->execute();

		$result = $stmt->get_result();
		
		if ($row = $result->fetch_assoc())
		{
			$existingPass = $row["Password"];
			return true;
		}
	
		return false;
	}

?>
