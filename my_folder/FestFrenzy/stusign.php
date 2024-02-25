<?php 
session_start();

include("connection.php");
include("functions.php");

if($_SERVER['REQUEST_METHOD'] == "POST")
{
    //something was posted
    $user_name = $_POST['user_name'];
    $password = $_POST['password'];

    if(!empty($user_name) && !empty($password) && !is_numeric($user_name))
    {
        //save to database
        $user_id = random_num(20);
        $query = "INSERT INTO users (user_id, user_name, password) VALUES ('$user_id', '$user_name', '$password')";

        mysqli_query($con, $query);

        header("Location: login.php");
        die;
    }
    else
    {
        echo "Please enter valid information!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FestFrenzy Sign Up</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.3/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Your existing styles */
    </style>
</head>
<body>
    <div class="navbar">
        <h1>FESTFRENZY</h1>
        <div>
            <a href="1stPage.html" class="nav-button">Home</a>
            <a href="about.html" class="nav-button">About</a>
            <a href="contact.html" class="nav-button">Contact</a>
        </div>
    </div>
    <div class="sign-up-card">
        <h1 class="student-sign-up text-3xl font-bold mb-2">STUDENT SIGN UP</h1>
        <p class="mb-6 text-gray-700"><b>This is for new Students only.</p>
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="space-y-4">
            <input type="text" name="user_name" placeholder="Enter your Name here" class="w-full p-3 rounded text-lg">
            <input type="email" name="email" placeholder="Enter your Email Address here" class="w-full p-3 rounded text-lg">
            <div class="relative">
                <i class="fas fa-venus-mars absolute text-lg" style="top: 10px; left: 10px;"></i>
                <select name="gender" class="pl-10 p-3 rounded text-lg w-48">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <input type="password" name="password" placeholder="Enter your password here" class="w-full p-3 rounded text-lg">
            <input type="password" name="confirm_password" placeholder="Confirm your password here" class="w-full p-3 rounded text-lg">
          
            <button type="submit" class="sign-up-btn font-bold">SIGN UP</button>
        </form>
    </div>
</body>
</html>
