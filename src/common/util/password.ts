/**
 * Password class provides utility methods for hashing and comparing passwords.
 * It uses the scrypt algorithm for secure password handling.
 *
 * @class Password
 *
 * @author Toyeeb Atunde
 */
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// Promisify the scrypt function
const scryptAsync = promisify(scrypt);

/**
 * @class Password
 * @static
 */
export class Password {
  /**
   * Hashes a plaintext password with a randomly generated salt.
   *
   * @static
   * @async
   * @param {string} password - The plaintext password to be hashed.
   * @returns {Promise<string>} A promise that resolves to the hashed password with salt.
   * @memberof Password
   */
  static async toHash(password: string): Promise<string> {
    // Generate a random salt
    const salt = randomBytes(8).toString("hex");

    // Hash the password using scrypt
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    // Return the hashed password concatenated with the salt
    return `${buf.toString("hex")}.${salt}`;
  }

  /**
   * Compares a supplied password with a stored password hash.
   *
   * @static
   * @async
   * @param {string} suppliedPassword - The plaintext password to be compared.
   * @param {string} storedPassword - The stored hashed password with salt.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the passwords match.
   * @memberof Password
   */
  static async compare(
    suppliedPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    // Split the stored password into hashed password and salt
    const [hashedPassword, salt] = storedPassword.split(".");

    // Hash the supplied password with the stored salt
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    // Compare the hashed passwords
    return buf.toString("hex") === hashedPassword;
  }
}
