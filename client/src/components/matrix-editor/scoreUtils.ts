export interface ScoreProperties {
  score?: number | null
}

export interface ScoreEdge {
  node?: { id?: string | null } | null
  properties?: ScoreProperties | null
}

export interface ConnectionWithEdges {
  edges?: Array<ScoreEdge | null> | null
}

export interface GeaMissionForScore {
  supportedByVisionsConnection?: ConnectionWithEdges | null
}

export interface GeaValueForScore {
  supportsMissionsConnection?: ConnectionWithEdges | null
  supportsVisionsConnection?: ConnectionWithEdges | null
}

export interface GeaGoalForScore {
  supportsMissionsConnection?: ConnectionWithEdges | null
  operationalizesVisionsConnection?: ConnectionWithEdges | null
  achievedByStrategiesConnection?: ConnectionWithEdges | null
}

export interface GeaStrategyForScore {
  achievesGoalsConnection?: ConnectionWithEdges | null
}

export const getEdgeScore = (
  edges: Array<ScoreEdge | null> | undefined,
  targetId: string
): number | null => {
  const edge = edges?.find(item => item?.node?.id === targetId)
  const score = edge?.properties?.score
  return typeof score === 'number' ? score : null
}

export const extractScoresFromConnection = (connection?: ConnectionWithEdges | null): number[] => {
  const edges = connection?.edges ?? []
  return edges
    .map(edge => edge?.properties?.score)
    .filter((score): score is number => typeof score === 'number')
}

export const calculateNormalizedScorePercent = (scores: Array<number | null>): number => {
  const validScores = scores.filter((score): score is number => typeof score === 'number')
  if (validScores.length === 0) {
    return 0
  }

  const totalScore = validScores.reduce((sum, score) => sum + score, 0)
  const averageScore = totalScore / validScores.length
  const scaledPercent = (averageScore / 3) * 100

  return Math.max(-100, Math.min(100, scaledPercent))
}

export const calculateGeaTotalScorePercent = (params: {
  missions: GeaMissionForScore[]
  values: GeaValueForScore[]
  goals: GeaGoalForScore[]
  strategies?: GeaStrategyForScore[]
}): number => {
  const missionVisionScores = params.missions.flatMap(mission =>
    extractScoresFromConnection(mission.supportedByVisionsConnection)
  )

  const valueMissionVisionScores = params.values.flatMap(value => [
    ...extractScoresFromConnection(value.supportsMissionsConnection),
    ...extractScoresFromConnection(value.supportsVisionsConnection),
  ])

  const goalMissionVisionAndStrategyScores = params.goals.flatMap(goal => [
    ...extractScoresFromConnection(goal.supportsMissionsConnection),
    ...extractScoresFromConnection(goal.operationalizesVisionsConnection),
    ...extractScoresFromConnection(goal.achievedByStrategiesConnection),
  ])

  const strategyGoalScores = (params.strategies ?? []).flatMap(strategy =>
    extractScoresFromConnection(strategy.achievesGoalsConnection)
  )

  return calculateNormalizedScorePercent([
    ...missionVisionScores,
    ...valueMissionVisionScores,
    ...goalMissionVisionAndStrategyScores,
    ...strategyGoalScores,
  ])
}
