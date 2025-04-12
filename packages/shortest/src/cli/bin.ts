#!/usr/bin/env node
import pc from "picocolors";
import {
  aiqaCommand,
  githubCodeCommand,
  initCommand,
  cacheCommands,
  clearCommand,
  detectFrameworkCommand,
  analyzeCommand,
  planCommand,
  generateCommand,
} from "@/cli/commands";
import { getLogger } from "@/log/index";
import { ShortestError } from "@/utils/errors";

process.removeAllListeners("warning");
process.on("warning", (warning) => {
  if (
    warning.name === "DeprecationWarning" &&
    warning.message.includes("punycode")
  ) {
    return;
  }
  console.warn(warning);
});

aiqaCommand.addCommand(initCommand);
initCommand.copyInheritedSettings(aiqaCommand);

aiqaCommand.addCommand(githubCodeCommand);
githubCodeCommand.copyInheritedSettings(aiqaCommand);

aiqaCommand.addCommand(cacheCommands);
cacheCommands.copyInheritedSettings(aiqaCommand);
clearCommand.copyInheritedSettings(cacheCommands);

aiqaCommand.addCommand(detectFrameworkCommand);
detectFrameworkCommand.copyInheritedSettings(aiqaCommand);

aiqaCommand.addCommand(analyzeCommand);
analyzeCommand.copyInheritedSettings(aiqaCommand);

aiqaCommand.addCommand(planCommand);
planCommand.copyInheritedSettings(aiqaCommand);

aiqaCommand.addCommand(generateCommand);
generateCommand.copyInheritedSettings(aiqaCommand);

const main = async () => {
  try {
    await aiqaCommand.parseAsync();
    process.exit(0);
  } catch (error) {
    const log = getLogger();
    log.trace("Handling error on main()");
    if (!(error instanceof ShortestError)) throw error;

    console.error(pc.red(error.name), error.message);
    process.exit(1);
  }
};

main().catch((error) => {
  const log = getLogger();
  log.trace("Handling error in main catch block");
  if (!(error instanceof ShortestError)) throw error;

  console.error(pc.red(error.name), error.message);
  process.exit(1);
});
