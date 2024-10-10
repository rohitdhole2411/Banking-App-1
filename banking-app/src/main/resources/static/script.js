document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('createAccountForm');
    const transactionForm = document.getElementById('transactionForm');
    const accountDetailsList = document.getElementById('accountDetails');

    // Create a new account
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const accountHolderName = document.getElementById('accountHolderName').value;
        const initialBalance = document.getElementById('initialBalance').value;

        fetch('/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountHolderName, balance: initialBalance })
        })
        .then(response => response.json())
        .then(data => {
            alert('Account created successfully!');
            loadAccounts();
        })
        .catch(error => console.error('Error:', error));
    });

    // Deposit/Withdraw money
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const accountId = document.getElementById('accountId').value;
        const amount = document.getElementById('amount').value;
        const transactionType = e.submitter.id === 'depositButton' ? 'deposit' : 'withdraw';

        fetch(`/api/accounts/${accountId}/${transactionType}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        })
        .then(response => response.json())
        .then(data => {
            alert('Transaction successful!');
            loadAccounts();
        })
        .catch(error => console.error('Error:', error));
    });

    // Delete an account
    function deleteAccount(accountId) {
        if (confirm('Are you sure you want to delete this account?')) {
            fetch(`/api/accounts/${accountId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    alert('Account deleted successfully!');
                    loadAccounts();
                } else {
                    alert('Failed to delete account.');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Load all accounts and add Delete button
    function loadAccounts() {
        fetch('/api/accounts')
            .then(response => response.json())
            .then(data => {
                accountDetailsList.innerHTML = ''; // Clear the list before loading
                data.forEach(account => {
                    const li = document.createElement('li');
                    li.innerHTML = `ID: ${account.id}, Name: ${account.accountHolderName}, Balance: ${account.balance}
                    <button onclick="deleteAccount(${account.id})">Delete</button>`;
                    accountDetailsList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Initially load all accounts
    loadAccounts();
});
