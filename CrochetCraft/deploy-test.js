// Simple deployment test script
console.log('🚀 CrochetCraft Deployment Test');

// Test localStorage functionality
try {
    localStorage.setItem('test', 'working');
    const test = localStorage.getItem('test');
    localStorage.removeItem('test');
    console.log('✅ LocalStorage: Working');
} catch (e) {
    console.log('❌ LocalStorage: Failed', e);
}

// Test essential functions
const tests = [
    () => typeof AuthManager !== 'undefined',
    () => typeof CartManager !== 'undefined', 
    () => typeof AdminManager !== 'undefined',
    () => typeof SessionManager !== 'undefined',
    () => typeof getAllPatterns === 'function'
];

tests.forEach((test, i) => {
    try {
        if (test()) {
            console.log(`✅ Test ${i + 1}: Passed`);
        } else {
            console.log(`❌ Test ${i + 1}: Failed`);
        }
    } catch (e) {
        console.log(`❌ Test ${i + 1}: Error -`, e.message);
    }
});

console.log('🎯 Deployment test complete!');