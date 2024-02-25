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
        //read from database
        $query = "SELECT * FROM users WHERE user_name = '$user_name' LIMIT 1";
        $result = mysqli_query($con, $query);

        if($result && mysqli_num_rows($result) > 0)
        {
            $user_data = mysqli_fetch_assoc($result);
            
            if(password_verify($password, $user_data['password']))
            {
                $_SESSION['user_id'] = $user_data['user_id'];
                header("Location: index.php");
                die;
            }
        }
        
        echo "Wrong username or password!";
    }
    else
    {
        echo "Please enter valid username and password!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Your existing head content -->
</head>
<body>
    <!-- Your existing body content -->
    <div class="bg-overlay">
        <!-- Your existing overlay content -->
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="login-panel shadow-lg">
            <h2 class="text-2xl font-bold mb-4">STUDENT LOGIN</h2>
            <p class="mb-4">Hey! Enter your details to sign in to your account</p>
            <div class="mb-6">
                <label class="flex items-center mb-2">
                    <i class="fas fa-user mr-2"></i>
                    <input type="text" name="user_name" class="form-input" placeholder="Enter your Username here">
                </label>
                <label class="flex items-center">
                    <i class="fas fa-lock mr-2"></i>
                    <input type="password" name="password" class="form-input" placeholder="Enter your password here">
                </label>
            </div>
            <button type="submit" class="action-button login-button mb-2">Log in</button>
            <p class="text-sm mb-4">Don't have an account yet?</p>
            <a href="signup.php" class="action-button sign-in-button">Sign up</a>
        </form>
    </div>
</body>
</html>
