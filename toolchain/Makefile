PREFIX ?= devops-bootcamp
INFRASTRUCTURE_STACK_NAME ?= $(PREFIX)-infrastructure
PIPELINE_STACK_NAME ?= $(PREFIX)-toolchain

PARAMETER_OVERRIDES += $(if $(GITHUB_TOKEN),GitHubToken="$(GITHUB_TOKEN)")
PARAMETER_OVERRIDES += $(if $(GITHUB_USER),GitHubUser="$(GITHUB_USER)")
PARAMETER_OVERRIDES += $(if $(GITHUB_REPO),GitHubRepo="$(GITHUB_REPO)")
PARAMETER_OVERRIDES += $(if $(GITHUB_BRANCH),GitHubBranch="$(GITHUB_BRANCH)")

default: check

check:
	@aws cloudformation validate-template --template-body file://infrastructure.yml
	@aws cloudformation validate-template --template-body file://pipeline.yml

infrastructure: check
	@aws cloudformation deploy \
		--template-file infrastructure.yml \
		--stack-name $(INFRASTRUCTURE_STACK_NAME) \
        --capabilities CAPABILITY_NAMED_IAM \
		--parameter-overrides Prefix=$(PREFIX)

infrastructure_outputs:
	$(eval INFRASTRUCTURE_OUTPUTS:=$(shell aws cloudformation describe-stacks --stack-name $(INFRASTRUCTURE_STACK_NAME) --query "Stacks[0].Outputs[].[join('=',[OutputKey,OutputValue])]" --output text ))
	$(eval INFRASTRUCTURE_OUTPUTS+=ServiceName=$(PREFIX)-service)
	$(eval INFRASTRUCTURE_OUTPUTS+=DeploymentGroupName=$(PREFIX)-service)

service: infrastructure infrastructure_outputs
	@env $(INFRASTRUCTURE_OUTPUTS) envsubst < service.json > service.json.out
	@env $(INFRASTRUCTURE_OUTPUTS) envsubst < deployment-group.json > deployment-group.json.out
	@-aws ecs create-service --cli-input-json file://service.json.out
	@-aws deploy create-deployment-group --cli-input-json file://deployment-group.json.out

rm-service: infrastructure_outputs
	@-env $(INFRASTRUCTURE_OUTPUTS) bash -c 'aws deploy delete-deployment-group --application-name $$ApplicationName --deployment-group-name $$DeploymentGroupName'
	@-env $(INFRASTRUCTURE_OUTPUTS) bash -c 'aws ecs update-service --cluster $$EcsClusterName --service $$ServiceName --desired-count 0'
	@-env $(INFRASTRUCTURE_OUTPUTS) bash -c 'aws ecs delete-service --cluster $$EcsClusterName --service $$ServiceName'


pipeline: check 
	$(eval PARAMETER_OVERRIDES += ApplicationName=$(PREFIX))
	$(eval PARAMETER_OVERRIDES += DeploymentGroupName=$(PREFIX)-service)
	@aws cloudformation deploy \
		--template-file pipeline.yml \
		--stack-name $(PIPELINE_STACK_NAME) \
        --capabilities CAPABILITY_NAMED_IAM \
        $(if $(strip $(PARAMETER_OVERRIDES)),--parameter-overrides $(PARAMETER_OVERRIDES))

.PHONY: default check infrastucture service pipeline
