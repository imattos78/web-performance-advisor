# Plan de Inicio - Agencia AI

## 1. Vision y objetivo
Construir una agencia AI capaz de crear apps, websites y extensiones con minima intervencion manual, operando de forma global y reusable entre proyectos.

Objetivo de 90 dias:
- Pasar de idea a MVP en 2 a 4 semanas.
- Automatizar al menos el 70% del flujo operativo.
- Lanzar 2 a 3 productos monetizables (app, template o extension).

## 2. Arquitectura global (siempre activa)
Para que funcione en todos los proyectos, la agencia debe vivir fuera de cada repo individual.

Componentes:
1. Control Plane central (24/7):
- Orquesta agentes, tareas, estados y politicas.
- Mantiene memoria compartida y auditoria.
- Corre en infraestructura cloud con alta disponibilidad.

2. Integracion GitHub App (multi-repo):
- Recibe eventos de issues, PRs, pushes y releases.
- Dispara agentes automaticamente en cualquier repositorio conectado.

3. Workflows reutilizables por organizacion:
- CI/CD, testing, seguridad y calidad centralizados.
- Cada repo hereda reglas sin duplicar configuraciones.

4. Templates base de proyecto:
- Plantilla App SaaS.
- Plantilla Website/Template comercial.
- Plantilla Extension (Chrome/Firefox).

## 3. Roles de agentes (estructura recomendada)
1. Orquestador (Project Manager AI):
- Divide objetivos en tareas, asigna agentes, controla progreso y riesgo.

2. Descubrimiento (Product + UX):
- Convierte objetivos en backlog, historias y criterios de aceptacion.

3. Arquitecto tecnico:
- Define stack, estructura de codigo, seguridad base y decisiones tecnicas.

4. Constructores especializados:
- Frontend Agent.
- Backend Agent.
- Extension Agent.

5. QA + Testing Agent:
- Genera y ejecuta pruebas unitarias, integracion y E2E.
- Valida Definition of Done.

6. Security + Compliance Agent:
- Escaneo de dependencias, secretos, permisos y politicas de privacidad.

7. DevOps + Release Agent:
- Build, deploy, rollback y gestion de ambientes.

8. Documentation Agent:
- README, changelog, handoff y guias operativas.

## 4. Agente de I+D (oportunidades de negocio)
Mision: detectar oportunidades monetizables y alimentar el pipeline con proyectos priorizados.

Sub-roles recomendados:
1. Scout Agent:
- Detecta tendencias, problemas y demanda en marketplaces, foros y redes.

2. Market Analyst Agent:
- Evalua competencia, TAM aproximado, pricing y barreras de entrada.

3. Monetization Strategist Agent:
- Define modelo de ingresos, precio inicial y upsells.

4. Validation Agent:
- Ejecuta validaciones rapidas (landing, waitlist, anuncios de test).

5. Portfolio Manager Agent:
- Prioriza oportunidades y decide cuales pasan a ejecucion.

Modelo de scoring sugerido:
OpportunityScore = 0.30(Demanda) + 0.25(Monetizacion) + 0.20(FitTecnico) + 0.15(Distribucion) + 0.10(CompetenciaInversa)

Umbral recomendado:
- Ejecutar solo ideas con score >= 75/100.

## 5. Flujo operativo autonomo (end-to-end)
1. Entra requerimiento u oportunidad.
2. Orquestador crea epica y plan de ejecucion.
3. Arquitectura + backlog aprobado por checklist.
4. Desarrollo paralelo por agentes especializados.
5. QA y seguridad bloquean o aprueban release.
6. Deploy a staging y validacion final.
7. Produccion automatica segun nivel de riesgo.

## 6. Niveles de autonomia y control
1. Riesgo bajo:
- Merge/deploy automatico.

2. Riesgo medio:
- Requiere aprobacion rapida (1 click o comentario).

3. Riesgo alto:
- Requiere revision humana obligatoria.

Tus 3 decisiones clave:
1. Que construir (prioridad de negocio).
2. Cuanto riesgo aceptar (politica de release).
3. Que estandar minimo exigir (calidad y seguridad).

## 7. Stack tecnico minimo (MVP)
- Gestion de trabajo: GitHub Projects o Linear.
- Codigo y PRs: GitHub + branch protection.
- Automatizacion: GitHub Actions.
- Orquestacion: API + workers + cola (ejemplo: Temporal o BullMQ).
- Persistencia: Postgres.
- Observabilidad: logs estructurados + alertas (Slack/email).

## 8. KPI para medir avance
1. Lead time por feature (idea -> deploy).
2. Porcentaje de tareas completadas sin intervencion humana.
3. Porcentaje de PRs aprobados al primer intento.
4. Bug rate post-release.
5. Tiempo de recuperacion ante fallos.
6. Conversion oportunidad -> MVP -> ingresos.

## 9. Plan por fases (primeros 90 dias)
Fase 1 (Semanas 1-2): Fundacion
- Definir playbook de agentes y contratos de entrada/salida.
- Configurar GitHub App y webhooks multi-repo.
- Crear 3 templates base (app/web/extension).

Fase 2 (Semanas 3-6): Automatizacion inicial
- Implementar orquestador y cola de tareas.
- Activar gates de QA, seguridad y performance.
- Lanzar primer pipeline autonomo de issue -> PR -> staging.

Fase 3 (Semanas 7-10): I+D y monetizacion
- Activar agente de I+D con ciclo semanal de oportunidades.
- Seleccionar top 3 ideas por score.
- Construir y validar 1 o 2 MVPs.

Fase 4 (Semanas 11-13): Escalado
- Estandarizar dashboards de KPI.
- Ajustar prompts y reglas por tasa de exito.
- Activar mas repos con la misma plataforma global.

## 10. Cadencia semanal recomendada
Lunes:
- Agente I+D entrega top oportunidades y ranking.

Martes:
- Seleccion de iniciativas a ejecutar (maximo 1 a 2 por ciclo).

Miercoles a jueves:
- Construccion automatizada + QA + seguridad.

Viernes:
- Deploy, retro, actualizacion de metricas y aprendizaje.

## 11. Checklist de inicio inmediato (esta semana)
1. Crear repositorio central de control-plane.
2. Crear GitHub App con permisos minimos necesarios.
3. Definir plantilla de issue, PR y Definition of Done.
4. Configurar workflow reusable para CI base.
5. Crear plantilla de scoring de oportunidades.
6. Ejecutar primer experimento de I+D con 10 ideas y elegir top 3.

## 12. Resultado esperado
Con esta estructura, tu agencia AI pasa de un enfoque manual por proyecto a una operacion global, siempre activa, con minima intervencion y foco directo en generar productos monetizables de forma continua.
