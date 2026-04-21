{{/*
Expand the name of the chart.
*/}}
{{- define "nextgen-eam.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "nextgen-eam.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart label.
*/}}
{{- define "nextgen-eam.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "nextgen-eam.labels" -}}
helm.sh/chart: {{ include "nextgen-eam.chart" . }}
app.kubernetes.io/name: {{ include "nextgen-eam.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels (component passed as extra arg)
*/}}
{{- define "nextgen-eam.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nextgen-eam.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: {{ . | toString }}
{{- end }}

{{/*
Resolve image for a component. Accepts a dict with keys: componentValues, globalValues.
Falls back from component-specific settings to global defaults.
*/}}
{{- define "nextgen-eam.image" -}}
{{- $comp := .component -}}
{{- $global := .global -}}
{{- $registry := $global.imageRegistry -}}
{{- $repo := ternary $comp.image.repository $global.imageRepository (ne (default "" $comp.image.repository) "") -}}
{{- $tag := ternary $comp.image.tag $global.imageTag (ne (default "" $comp.image.tag) "") -}}
{{- $fullRepo := ternary $repo (printf "%s/%s" $global.imageRepository $repo) (contains "/" $repo) -}}
{{- printf "%s/%s:%s" $registry $fullRepo $tag -}}
{{- end }}

{{/*
Image pull policy fallback
*/}}
{{- define "nextgen-eam.pullPolicy" -}}
{{- $comp := .component -}}
{{- $global := .global -}}
{{- default $global.imagePullPolicy $comp.image.pullPolicy -}}
{{- end }}

{{/*
Hostname for a subdomain
*/}}
{{- define "nextgen-eam.hostname" -}}
{{- printf "%s.%s" .subdomain .domain -}}
{{- end }}

{{/*
AI secret environment variables injected into ai-server and ai-worker containers.
Only injects refs for secrets that were provided via existingSecret or created by this chart.
*/}}
{{- define "nextgen-eam.aiSecretEnv" -}}
{{- $fullName := include "nextgen-eam.fullname" . -}}
{{- $ai := .Values.ai -}}
{{- if or $ai.llm.apiKey $ai.llm.existingSecret }}
- name: AI_LLM_API_KEY
  valueFrom:
    secretKeyRef:
      name: {{ default (printf "%s-ai-llm" $fullName) $ai.llm.existingSecret }}
      key: {{ default "apiKey" $ai.llm.existingSecretApiKeyField }}
{{- end }}
{{- if or $ai.agentConfig.bootstrapClientSecret $ai.agentConfig.existingSecret }}
- name: AI_AGENT_CONFIG_BOOTSTRAP_CLIENT_ID
  valueFrom:
    secretKeyRef:
      name: {{ default (printf "%s-ai-agent-config" $fullName) $ai.agentConfig.existingSecret }}
      key: {{ default "clientId" $ai.agentConfig.existingSecretClientIdField }}
- name: AI_AGENT_CONFIG_BOOTSTRAP_CLIENT_SECRET
  valueFrom:
    secretKeyRef:
      name: {{ default (printf "%s-ai-agent-config" $fullName) $ai.agentConfig.existingSecret }}
      key: {{ default "clientSecret" $ai.agentConfig.existingSecretClientSecretField }}
{{- end }}
{{- if or $ai.web.searxngApiKey $ai.web.searxngExistingSecret }}
- name: AI_SEARCH_SEARXNG_API_KEY
  valueFrom:
    secretKeyRef:
      name: {{ default (printf "%s-ai-searxng" $fullName) $ai.web.searxngExistingSecret }}
      key: {{ default "apiKey" $ai.web.searxngExistingSecretKey }}
{{- end }}
{{- end }}

{{/*
Analytics runtime Keycloak bootstrap credentials.
Prefers analytics.runtime.auth settings and falls back to legacy ai.agentConfig values.
*/}}
{{- define "nextgen-eam.analyticsRuntimeSecretEnv" -}}
{{- $fullName := include "nextgen-eam.fullname" . -}}
{{- $runtimeAuth := .Values.analytics.runtime.auth -}}
{{- $legacyAuth := .Values.ai.agentConfig -}}
{{- $existingSecret := default $legacyAuth.existingSecret $runtimeAuth.existingSecret -}}
{{- $clientIdField := default (default "clientId" $legacyAuth.existingSecretClientIdField) $runtimeAuth.existingSecretClientIdField -}}
{{- $clientSecretField := default (default "clientSecret" $legacyAuth.existingSecretClientSecretField) $runtimeAuth.existingSecretClientSecretField -}}
{{- $bootstrapClientSecret := default $legacyAuth.bootstrapClientSecret $runtimeAuth.bootstrapClientSecret -}}
{{- if or $existingSecret $bootstrapClientSecret }}
- name: AI_AGENT_CONFIG_BOOTSTRAP_CLIENT_ID
  valueFrom:
    secretKeyRef:
      name: {{ default (printf "%s-analytics-runtime-auth" $fullName) $existingSecret }}
      key: {{ $clientIdField }}
- name: AI_AGENT_CONFIG_BOOTSTRAP_CLIENT_SECRET
  valueFrom:
    secretKeyRef:
      name: {{ default (printf "%s-analytics-runtime-auth" $fullName) $existingSecret }}
      key: {{ $clientSecretField }}
{{- end }}
{{- end }}

    {{/*
    Stable Cubestore worker DNS addresses for the cluster.
    */}}
    {{- define "nextgen-eam.cubestoreWorkers" -}}
    {{- $fullName := include "nextgen-eam.fullname" . -}}
    {{- $replicas := int .Values.analytics.cubestore.worker.replicas -}}
    {{- $port := int .Values.analytics.cubestore.worker.port -}}
    {{- range $index, $_ := until $replicas -}}
    {{- if gt $index 0 }},{{ end -}}
    {{ printf "%s-cubestore-worker-%d.%s-cubestore-worker:%d" $fullName $index $fullName $port }}
    {{- end -}}
    {{- end }}
