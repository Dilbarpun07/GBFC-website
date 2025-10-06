// Input validation utilities

export const validateTeamName = (name: string): string => {
  if (!name || name.trim().length === 0) {
    throw new Error('Team name is required');
  }

  if (name.length > 100) {
    throw new Error('Team name must be less than 100 characters');
  }

  // Remove any potential script tags or SQL-like patterns
  const sanitized = name
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();

  if (sanitized.length === 0) {
    throw new Error('Invalid team name');
  }

  return sanitized;
};

export const validatePlayerData = (player: any) => {
  const validated = {
    name: '',
    position: '',
    matchesPlayed: 0,
    trainingsAttended: 0,
    goals: 0,
    assists: 0
  };

  // Validate name
  if (!player.name || player.name.trim().length === 0) {
    throw new Error('Player name is required');
  }
  validated.name = player.name.trim().substring(0, 100);

  // Validate position (optional but sanitize)
  if (player.position) {
    validated.position = player.position.trim().substring(0, 50);
  }

  // Validate numeric fields
  const numericFields = ['matchesPlayed', 'trainingsAttended', 'goals', 'assists'];
  for (const field of numericFields) {
    const value = parseInt(player[field], 10);
    if (isNaN(value) || value < 0) {
      throw new Error(`Invalid ${field} value`);
    }
    validated[field] = Math.min(value, 9999); // Set reasonable max
  }

  return validated;
};

export const sanitizeHtml = (input: string): string => {
  // Basic HTML sanitization - consider using DOMPurify for production
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
};

// Validate match data
export const validateMatchData = (match: any) => {
  const validated = {
    opponent: '',
    date: '',
    time: '',
    location: ''
  };

  // Validate opponent
  if (!match.opponent || match.opponent.trim().length === 0) {
    throw new Error('Opponent name is required');
  }
  validated.opponent = match.opponent.trim().substring(0, 100);

  // Validate date
  if (!match.date || match.date.trim().length === 0) {
    throw new Error('Match date is required');
  }
  validated.date = match.date.trim();

  // Validate time
  if (!match.time || match.time.trim().length === 0) {
    throw new Error('Match time is required');
  }
  validated.time = match.time.trim();

  // Validate location
  if (!match.location || match.location.trim().length === 0) {
    throw new Error('Match location is required');
  }
  validated.location = match.location.trim().substring(0, 100);

  return validated;
};

// Validate training session data
export const validateTrainingData = (training: any) => {
  const validated = {
    date: ''
  };

  // Validate date
  if (!training.date || training.date.trim().length === 0) {
    throw new Error('Training date is required');
  }
  validated.date = training.date.trim();

  return validated;
};

// Enhanced input sanitization for security
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>'"]/g, '') // Remove dangerous characters
    .substring(0, 1000); // Limit length
};