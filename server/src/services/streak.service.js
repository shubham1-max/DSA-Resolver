const User = require("../models/user.models");

// tzOffset = minutes behind UTC sent by client header X-TZ-Offset
// e.g. IST = -330 (UTC+5:30 → offset is -330 minutes from UTC)
// new Date().getTimezoneOffset() in browser returns this value

const toLocalDateStr = (date, tzOffsetMinutes) => {
  // browser getTimezoneOffset() returns (UTC - local) in minutes
  // e.g. IST (UTC+5:30) => -330. To get local time: date + (-tzOffset * 60000)
  // which equals date.getTime() + (-tzOffsetMinutes) * 60 * 1000
  const local = new Date(date.getTime() + (-tzOffsetMinutes) * 60 * 1000);

  return local.toISOString().slice(0, 10); // "YYYY-MM-DD"
};

const updateStreak = async (userId, tzOffset = 0) => {
  const user = await User.findById(userId);

  if (!user) return;

  const todayStr = toLocalDateStr(new Date(), tzOffset);

  const lastSolved = user.lastSolvedDate;

  const lastStr = lastSolved
    ? toLocalDateStr(lastSolved, tzOffset)
    : null;

  // Already solved today — don't increment again
  if (lastStr === todayStr) return;

  // Get yesterday's date string
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayStr = toLocalDateStr(yesterday, tzOffset);

  let newStreak;

  if (lastStr === yesterdayStr) {
    // Solved yesterday → continue streak
    newStreak = user.streak + 1;
  } else {
    // Missed a day (or first ever solve) → reset to 1
    newStreak = 1;
  }

  await User.findByIdAndUpdate(userId, {
    streak: newStreak,
    lastSolvedDate: new Date(),
    longestStreak: Math.max(user.longestStreak || 0, newStreak),
    $inc: {
      totalSolved: 1,
    },
  });
};

module.exports = {
  updateStreak,
};