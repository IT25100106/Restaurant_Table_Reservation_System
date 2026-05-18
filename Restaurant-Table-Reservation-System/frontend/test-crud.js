

async function testCRUD() {
    const baseUrl = 'http://localhost:8080/api/users';
    
    // 1. Create
    console.log('Testing Create...');
    const createRes = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Node Test\nUser|pipe', email: 'nodetest@example.com', password: 'password123' })
    });
    const createData = await createRes.json();
    console.log('Create Response:', createData);
    
    if (!createData.success) {
        console.error('Create failed, aborting');
        return;
    }
    const userId = createData.user.id;
    
    // 2. Read All
    console.log('Testing Read All...');
    const readRes = await fetch(baseUrl);
    const readData = await readRes.json();
    console.log(`Found ${readData.length} users`);
    
    // 3. Update
    console.log(`Testing Update for user ${userId}...`);
    const updateRes = await fetch(`${baseUrl}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Node Test Updated' })
    });
    const updateData = await updateRes.json();
    console.log('Update Response:', updateData);
    
    // 4. Delete
    console.log(`Testing Delete for user ${userId}...`);
    const deleteRes = await fetch(`${baseUrl}/${userId}`, {
        method: 'DELETE'
    });
    const deleteData = await deleteRes.json();
    console.log('Delete Response:', deleteData);
    
    console.log('CRUD Test Complete!');
}

testCRUD();
