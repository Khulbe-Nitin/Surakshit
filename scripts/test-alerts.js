/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Test script for Surakshit Alert System
 * 
 * This script helps test the email service and alert system functionality
 * 
 * Usage:
 * 1. Make sure your development server is running (npm run dev)
 * 2. Update the EMAIL_TO constant with your test email
 * 3. Run: node scripts/test-alerts.js
 */

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const cronSecret = process.env.CRON_SECRET || 'Surakshit-cron-secret-key-2025';

// Configuration
const EMAIL_TO = 'your-test-email@example.com'; // Change this to your email

async function testFetchAlerts() {
  console.log('\n📡 Testing Alert Fetch API...');
  try {
    const response = await fetch(`${baseUrl}/api/alerts`);
    const data = await response.json();
    
    console.log('✅ Alerts fetched successfully');
    console.log(`   Found ${data.count} alerts`);
    console.log('   Sample alert:', data.alerts[0]?.title || 'No alerts');
    return true;
  } catch (error) {
    console.error('❌ Failed to fetch alerts:', error.message);
    return false;
  }
}

async function testSubscribe() {
  console.log('\n✉️  Testing Email Subscription...');
  try {
    const response = await fetch(`${baseUrl}/api/alerts/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL_TO }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Subscription successful');
      console.log('   Message:', data.message);
      console.log('   Check your email for a welcome message!');
      return true;
    } else {
      console.log('⚠️  Subscription response:', data.error || data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to subscribe:', error.message);
    return false;
  }
}

async function testCronJob() {
  console.log('\n⏰ Testing Cron Job (Alert Check)...');
  try {
    const response = await fetch(`${baseUrl}/api/alerts/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`,
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Cron job executed successfully');
      console.log('   New alerts found:', data.newAlerts);
      console.log('   Emails sent:', data.emailsSent);
      console.log('   Message:', data.message);
      return true;
    } else {
      console.error('❌ Cron job failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to run cron job:', error.message);
    return false;
  }
}

async function testUnsubscribe() {
  console.log('\n🚫 Testing Email Unsubscription...');
  try {
    const response = await fetch(`${baseUrl}/api/alerts/subscribe`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL_TO }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Unsubscription successful');
      console.log('   Message:', data.message);
      return true;
    } else {
      console.log('⚠️  Unsubscription response:', data.error || data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to unsubscribe:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Surakshit Alert System Test Suite');
  console.log('=====================================');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Test Email: ${EMAIL_TO}`);
  
  if (EMAIL_TO === 'your-test-email@example.com') {
    console.log('\n⚠️  WARNING: Please update the EMAIL_TO constant in this script!');
    console.log('   Set it to your actual email address to receive test emails.\n');
  }
  
  const results = {
    fetchAlerts: false,
    subscribe: false,
    cronJob: false,
    unsubscribe: false,
  };
  
  // Test 1: Fetch Alerts
  results.fetchAlerts = await testFetchAlerts();
  await sleep(1000);
  
  // Test 2: Subscribe
  results.subscribe = await testSubscribe();
  await sleep(2000);
  
  // Test 3: Cron Job (only if subscribed successfully)
  if (results.subscribe) {
    results.cronJob = await testCronJob();
    await sleep(2000);
  } else {
    console.log('\n⏭️  Skipping cron job test (subscription failed)');
  }
  
  // Test 4: Unsubscribe
  // Uncomment the lines below if you want to test unsubscription
  // results.unsubscribe = await testUnsubscribe();
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('======================');
  console.log(`Fetch Alerts:    ${results.fetchAlerts ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Subscribe:       ${results.subscribe ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Cron Job:        ${results.cronJob ? '✅ PASS' : '⏭️ SKIPPED'}`);
  console.log(`Unsubscribe:     ${results.unsubscribe ? '✅ PASS' : '⏭️ SKIPPED'}`);
  
  console.log('\n💡 Tips:');
  console.log('   - Check your email inbox for the welcome message');
  console.log('   - If using smtp4dev, check http://localhost:3001');
  console.log('   - Make sure PostgreSQL database is running');
  console.log('   - Make sure SMTP server is configured correctly');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the tests
runTests().catch(console.error);
