// ... previous imports remain same ...

// Inside Workbench component, update the handleStepSubmit function:
const handleStepSubmit = async () => {
  const deployer = getDeployer(selectedPlatform);
  if (!deployer || !deployer.steps) {
    handleDeploy();
    return;
  }

  const currentStepData = deployer.steps[currentStep];
  if (currentStepData.validate) {
    const validationResult = await currentStepData.validate(stepInputs);
    if (!validationResult.isValid) {
      toast.error(validationResult.error || 'Validation failed');
      return;
    }
  }

  if (currentStep < deployer.steps.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    handleDeploy();
  }
};

// Update Dialog content to handle both inputs and steps
<DialogDescription>
  <label>
    <Select.Root
      value={selectedPlatform}
      onValueChange={(value) => {
        setSelectedPlatform(value);
        setCurrentStep(0);
        setStepInputs({});
      }}
    >
      {/* ... Select content remains the same ... */}
    </Select.Root>
  </label>
  
  {selectedPlatform && (
    <div className="mt-4">
      {(() => {
        const deployer = getDeployer(selectedPlatform);
        if (!deployer) return null;

        if (deployer.steps) {
          const currentStepData = deployer.steps[currentStep];
          return (
            <>
              <h3 className="text-lg font-medium mb-4">{currentStepData.title}</h3>
              {currentStepData.inputs.map((input, index) => (
                <label key={index} className="block mt-4">
                  <span className="text-bolt-elements-textPrimary text-sm">{input.name}</span>
                  <input
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    required={input.required}
                    value={stepInputs[input.name] || ''}
                    onChange={(e) => {
                      setStepInputs(prev => ({
                        ...prev,
                        [input.name]: e.target.value
                      }));
                    }}
                    className="w-full mt-1 px-2 py-1 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary"
                  />
                </label>
              ))}
            </>
          );
        }

        return deployer.inputs?.map((input, index) => (
          <label key={index} className="block mt-4">
            <span className="text-bolt-elements-textPrimary text-sm">{input.name}</span>
            <input
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              required={input.required}
              value={stepInputs[input.name] || ''}
              onChange={(e) => {
                setStepInputs(prev => ({
                  ...prev,
                  [input.name]: e.target.value
                }));
              }}
              className="w-full mt-1 px-2 py-1 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary"
            />
          </label>
        ));
      })()}
    </div>
  )}
</DialogDescription>

<div className="px-5 pb-4 bg-bolt-elements-background-depth-2 flex gap-2 justify-end">
  <DialogButton type="secondary" onClick={() => {
    setModalOpen(false);
    setCurrentStep(0);
    setStepInputs({});
  }}>
    Cancel
  </DialogButton>
  {getDeployer(selectedPlatform)?.steps && currentStep > 0 && (
    <DialogButton type="secondary" onClick={() => setCurrentStep(currentStep - 1)}>
      Back
    </DialogButton>
  )}
  <DialogButton
    type="primary"
    disabled={!selectedPlatform}
    onClick={handleStepSubmit}
  >
    {getDeployer(selectedPlatform)?.steps 
      ? currentStep < (getDeployer(selectedPlatform)?.steps?.length || 0) - 1 
        ? 'Next' 
        : 'Deploy'
      : 'Deploy'}
  </DialogButton>
</div>
