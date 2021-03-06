import { Instance } from '../../models';
import * as inquirer from 'inquirer';
import { BaseCommand } from '../../utils';

export default class InstanceRebootCommand extends BaseCommand {

  static description = 'Reboots an instance from the cloud service'

  static examples = [
    `$ cloud-service instance:reboot`,
  ]

  static flags = Object.assign({
  }, BaseCommand.baseFlags);

  async run() {
    const {args, flags} = this.parse(InstanceRebootCommand)
    
    this.cloudServiceUrl = flags.url;

    const instances: Instance[] = await this.getInstances();
    const activeInstances = instances.filter(instance => instance.state.status === 'ACTIVE');
    if (activeInstances.length > 0) {
      const questions = [{
        type: 'list',
        name: 'instanceId',
        message: 'Choose an instance for the authorisation token',
        filter: Number,
        choices: activeInstances.map(instance => {
          return {
            name: `${instance.name} (id=${instance.id}, image=${instance.image.name}, status=${instance.state.status})`,
            value: instance.id
          };
        })
      }];
  
      try {
        const answers = await inquirer.prompt<{instanceId: number}>(questions);
  
        console.log(`Getting authorisation token for instance ${answers.instanceId}...`);
        const token = await this.getInstanceAuthorisationToken(answers.instanceId);
        console.log(`... token is : '${token.token}'`);
    
      } catch (error) {
        console.error(error.message);
      } 
    
    } else {
      console.log('There are currently no active instances');
    }

  }
}
