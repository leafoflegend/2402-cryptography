import bcrypt from 'bcrypt';

const encrypt = async (password) => {
    const encryptedPassword = await bcrypt.hash(password, 5);

    return encryptedPassword;
};

let encryptedPassword = null;
let encryptedPassword2 = null;

const runEncryption = async () => {
    encryptedPassword = await encrypt('password123');

    console.log('Encrypted Password', encryptedPassword);
}

const comparePasswords = async (password) => {
    await runEncryption();

    const login = async (password) => {
        const isAuthenticated = await bcrypt.compare(
            password,
            encryptedPassword,
        );

        if (isAuthenticated) {
            console.log('Success! You have logged in!');
        } else {
            console.log('Failed to login!');
        }
    };

    await login(password);
}

comparePasswords('password123');
