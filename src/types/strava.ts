export interface MetaAthlete { id: number; resource_state: number }

export interface PolylineMap {
  id: string
  polyline?: string
  summary_polyline: string
  resource_state: number
}

export interface SummaryActivity {
  id: number
  external_id: string
  upload_id: number
  athlete: MetaAthlete
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: string
  sport_type: string
  workout_type: number | null
  start_date: string
  start_date_local: string
  timezone: string
  start_latlng: [number, number] | []
  end_latlng: [number, number] | []
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  total_photo_count: number
  map: PolylineMap
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  flagged: boolean
  gear_id: string | null
  average_speed: number
  max_speed: number
  average_cadence?: number
  average_watts?: number
  weighted_average_watts?: number
  kilojoules?: number
  device_watts?: boolean
  has_heartrate: boolean
  average_heartrate?: number
  max_heartrate?: number
  max_watts?: number
  pr_count: number
  has_kudoed: boolean
  suffer_score: number | null
}

export interface DetailedActivity extends SummaryActivity {
  description: string | null
  calories: number
  device_name: string | null
  embed_token: string
  average_temp?: number
  elev_high?: number
  elev_low?: number
  splits_metric: Split[]
  splits_standard: Split[]
  laps: Lap[]
}

export interface Split {
  distance: number
  elapsed_time: number
  moving_time: number
  elevation_difference: number
  split: number
  average_speed: number
  average_heartrate?: number
  pace_zone: number
}

export interface Lap {
  id: number
  name: string
  elapsed_time: number
  moving_time: number
  distance: number
  start_date: string
  start_date_local: string
  start_index: number
  end_index: number
  total_elevation_gain: number
  average_speed: number
  max_speed: number
  average_heartrate?: number
  max_heartrate?: number
  lap_index: number
  split: number
  pace_zone: number
  average_cadence?: number
  average_watts?: number
}

export interface ActivityTotal {
  count: number
  distance: number
  moving_time: number
  elapsed_time: number
  elevation_gain: number
  achievement_count?: number
}

export interface ActivityStats {
  biggest_ride_distance: number
  biggest_climb_elevation_gain: number
  recent_ride_totals: ActivityTotal
  recent_run_totals: ActivityTotal
  recent_swim_totals: ActivityTotal
  ytd_ride_totals: ActivityTotal
  ytd_run_totals: ActivityTotal
  ytd_swim_totals: ActivityTotal
  all_ride_totals: ActivityTotal
  all_run_totals: ActivityTotal
  all_swim_totals: ActivityTotal
}

export interface DetailedAthlete {
  id: number
  username: string
  firstname: string
  lastname: string
  bio: string
  city: string
  state: string
  country: string
  sex: 'M' | 'F'
  profile: string
  profile_medium: string
  created_at: string
  updated_at: string
  measurement_preference: 'feet' | 'meters'
  ftp: number | null
  weight: number | null
  athlete_type: 0 | 1
}

export interface ZoneRange { min: number; max: number }
export interface Zones {
  heart_rate: { custom_zones: boolean; zones: ZoneRange[] }
  power?: { zones: ZoneRange[] }
}

export interface Stream<T> {
  data: T[]
  series_type: 'distance' | 'time'
  original_size: number
  resolution: 'low' | 'medium' | 'high'
}
export interface StreamSet {
  time?: Stream<number>
  distance?: Stream<number>
  latlng?: Stream<[number, number]>
  altitude?: Stream<number>
  velocity_smooth?: Stream<number>
  heartrate?: Stream<number>
  cadence?: Stream<number>
  watts?: Stream<number>
  temp?: Stream<number>
  moving?: Stream<boolean>
  grade_smooth?: Stream<number>
}
