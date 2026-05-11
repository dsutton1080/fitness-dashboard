export interface OuraMeta {
  updated_at: string
  version: number
}

export interface PublicDailyReadiness {
  id: string
  day: string
  timestamp: string
  score: number | null
  temperature_deviation: number | null
  temperature_trend_deviation: number | null
  contributors: {
    activity_balance: number | null
    body_temperature: number | null
    hrv_balance: number | null
    previous_day_activity: number | null
    previous_night: number | null
    recovery_index: number | null
    resting_heart_rate: number | null
    sleep_balance: number | null
    sleep_regularity: number | null
  }
  meta: OuraMeta
}

export interface PublicDailySleep {
  id: string
  day: string
  timestamp: string
  score: number | null
  contributors: {
    deep_sleep: number | null
    efficiency: number | null
    latency: number | null
    rem_sleep: number | null
    restfulness: number | null
    timing: number | null
    total_sleep: number | null
  }
  meta: OuraMeta
}

export interface PublicModifiedSleepModel {
  id: string
  day: string
  bedtime_start: string
  bedtime_end: string
  time_in_bed: number
  total_sleep_duration: number | null
  awake_time: number | null
  deep_sleep_duration: number | null
  light_sleep_duration: number | null
  rem_sleep_duration: number | null
  latency: number | null
  efficiency: number | null
  restless_periods: number | null
  average_breath: number | null
  average_heart_rate: number | null
  lowest_heart_rate: number | null
  average_hrv: number | null
  type: 'deleted' | 'sleep' | 'long_sleep' | 'late_nap' | 'rest' | null
  meta: OuraMeta
}

export interface PublicDailyActivity {
  id: string
  day: string
  timestamp: string
  score: number | null
  active_calories: number
  total_calories: number
  steps: number
  equivalent_walking_distance: number
  high_activity_time: number
  medium_activity_time: number
  low_activity_time: number
  sedentary_time: number
  resting_time: number
  meta: OuraMeta
}

export interface PublicDailyStress {
  id: string
  day: string
  stress_high: number | null
  recovery_high: number | null
  day_summary: 'restored' | 'normal' | 'stressful' | null
  meta: OuraMeta
}

export interface PublicWorkout {
  id: string
  day: string
  start_datetime: string
  end_datetime: string
  activity: string
  intensity: 'easy' | 'moderate' | 'hard'
  source: 'manual' | 'autodetected' | 'confirmed' | 'workout_heart_rate'
  calories: number | null
  distance: number | null
  label: string | null
  meta: OuraMeta
}
