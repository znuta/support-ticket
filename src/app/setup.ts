/**
 * setupRootAdmin.ts defines a function to set up the root admin user.
 * It checks if a root admin already exists in the database. If not, it creates a new root admin user.
 * The function is typically called during the server startup to ensure the presence of a root admin.
 *
 * @technote Note: The password hashing  was handled in the database schema before saving it.
 * Remember to set the admin email and password details in the environment variables.
 *
 * @author Toyeeb Atunde
 */

// Import the User model from the authentication service
import { User } from "../auth-srv/models";

// Define a function to set up the root admin user
const setupRootAdmin = async () => {
  try {
    // Check if a root admin already exists in the database
    const existingAdmin = await User.findOne({ role: "admin" });

    if (!existingAdmin) {
      // Create a new root admin user
      const rootAdmin = User.build({
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
        role: "admin",
      });

      // Save the new root admin user to the database
      await rootAdmin.save();
      console.log("Root admin user created successfully");
    } else {
      console.log("Root admin user already exists");
    }
  } catch (error) {
    // Log any errors that occur during the setup process and exit the application with an error code
    console.error("Error during setup:", error);
    process.exit(1);
  }
};

// Call the setupRootAdmin function to set up the root admin user during server startup
setupRootAdmin();
