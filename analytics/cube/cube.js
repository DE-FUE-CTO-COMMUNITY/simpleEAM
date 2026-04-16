module.exports = {
  contextToAppId: ({ securityContext }) => securityContext?.companyId || 'shared',
  contextToOrchestratorId: ({ securityContext }) => securityContext?.companyId || 'shared',
}
