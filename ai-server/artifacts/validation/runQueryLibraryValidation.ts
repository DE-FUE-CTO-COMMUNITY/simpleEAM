import { formatValidationReport, validateQueryLibrary } from './queryLibraryValidator'

function run(): void {
  const report = validateQueryLibrary()
  console.log(formatValidationReport(report))

  if (report.errors.length > 0) {
    process.exitCode = 1
    return
  }

  console.log('Query library validation succeeded.')
}

run()
