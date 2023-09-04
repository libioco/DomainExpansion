<?php

        $inData = getRequestInfo();

        $id = 0;
        $firstName = "";
        $lastName = "";
        $login = "";
        $password = "";

        $searchResults = "";
        $searchCount = 3;

        $conn = new mysqli("localhost", "domain", "expansion", "COP4331");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {
                $stmt = $conn->prepare("select * from User where FirstName like ? and UserID=?");
                $firstName = "%" . $inData["search"] . "%";
                $stmt->bind_param("ss", $firstName, $inData["userId"]);
                $stmt->execute();

                $result = $stmt->get_result();

                while($row = $result->fetch_assoc())
                {
                        if( $searchCount > 3 )
                        {
                                $searchResults .= ",";
                        }
                        $searchCount++;
                        $searchResults .= '{"FirstName" : "' . $row{"FirstName"}. '"}';
                }

                if( $searchCount == 3 )
                {
                        returnWithError( "No Records Found" );
                }
                else
                {
                        $id = $searchCount++;
                        returnWithInfo( $searchResults );
                }

                $stmt->close();
                $conn->close();
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
                $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo( $searchResults )
        {
                $retValue = '{"results":[' . $searchResults . '],"error":""}';
                sendResultInfoAsJson( $retValue );
        }

?>

