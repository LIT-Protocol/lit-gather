import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from "@heroicons/react/solid";
import BoxToggle from "../Ui/BoxToggle";
import ButtonRect from "../Ui/ButtonRect";
import { useState } from 'react';

const ProgressContent = ({children, steps = [
    <>Please provide your content</>,
]
}) => {

    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="lit-scroll">

            {/* ----- Progress Header ----- */}
            <div className="flex justify-between">
                <h1 className="leading-tight text-5xl text-white">
                Create Gated Area(s)
                </h1>

                <div className="flex mt-auto mb-auto ml-24">
                    {
                        steps.map((step, i) => {
                            return (
                                <BoxToggle
                                    onClick={() => setCurrentStep(i)}
                                    key={i}
                                    current={i == currentStep}
                                    checked={i < currentStep}
                                    isLast={(steps.length - 1) <= i}
                                />
                            )
                        })
                    }
                </div>
            </div>

            {/* ----- Notes ----- */}
            {/* <div className='text-purple-text text-sm mt-3'>
                <span className='text-red'>*</span>
                <span className='ml-1 text-grey-text tracking-widest'>REQUIRED FIELDS</span>
            </div> */}

            {/* ----- Progress Content ----- */}
            <div className="flex mt-12">
                { steps?.[currentStep]?.content }
            </div>

            {/* ----- Controls Section ----- */}
            <div className="flex justify-between mt-12">

                <ButtonRect 
                    onClick={(e) => steps?.[currentStep]?.onBack ? steps?.[currentStep]?.onBack({
                        callback: () => setCurrentStep(currentStep <=0 ? 0 : currentStep -= 1),
                        reset: () => setCurrentStep(0),
                    }) : setCurrentStep(currentStep <=0 ? 0 : currentStep -= 1)} 
                    icon={<ArrowNarrowLeftIcon/>} 
                    text={steps?.[currentStep]?.back ?? 'Back'}
                    hidden={steps?.[currentStep]?.hideBackButton || currentStep == 0} 
                />

                <ButtonRect 
                    onClick={(e) => steps?.[currentStep]?.onNext ? steps?.[currentStep]?.onNext({callback: () => setCurrentStep(currentStep += 1)}) : setCurrentStep(currentStep += 1)} 
                    icon={<ArrowNarrowRightIcon/>} 
                    iconFirst={false} 
                    hideNextIcon={steps?.[currentStep]?.hideNextIcon ?? false} 
                    text={steps?.[currentStep]?.next ?? 'Next'}
                    hidden={steps?.[currentStep]?.hideNextButton} 
                />
            </div>
            {/* ----- ...Controls Section -----  */}
        </div>
    );
}

export default ProgressContent;