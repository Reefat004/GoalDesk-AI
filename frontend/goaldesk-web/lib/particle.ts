// Particle Cloud API Service (Mock for Phase 1 MVP)

export async function sendParticleMessage(deviceId: string, line1: string, line2: string): Promise<boolean> {
  // In Phase 3, this will call the actual Particle Cloud API
  // https://api.particle.io/v1/devices/{deviceId}/setDisplay
  
  const payload = `${line1}|${line2}`;
  
  console.log(`\n=== [MOCK PARTICLE API] ===`);
  console.log(`To Device: ${deviceId}`);
  console.log(`Payload  : "${payload}"`);
  console.log(`LCD Line 1: [${line1}]`);
  console.log(`LCD Line 2: [${line2}]`);
  console.log(`===========================\n`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return true;
}
