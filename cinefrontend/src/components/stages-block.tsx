import { Timeline } from "@chakra-ui/react";
import React, {
  useEffect,
  useContext,
  createContext,
  useState,
  useMemo,
  useCallback,
} from "react";

type TStageBlockProps<T, K extends keyof T = keyof T> = {
  readonly name: K;
  readonly icon: React.ReactNode;
  readonly label: (_: boolean, __: T[K]) => React.ReactNode;
  readonly children: TStagesBlockReturn<T[K]>;
};

type TStagesBlockProps<T> = {
  readonly defaultValues: T;
  readonly onChange?: (_: T) => void;
  readonly onComplete?: (_: T) => void;
  readonly onStageChange?: (_: keyof T) => void;
  readonly children: any;
};

type TStagesBlockParams<FieldType> = {
  readonly active: boolean;
  readonly value: FieldType;
  readonly handlePrev: () => void;
  readonly handleNext: () => void;
  readonly handleChange: (_: FieldType) => void;
  readonly handleBlur: () => void;
};

type TBlockSetupParams = React.ReactNode;

type StagesContextType<StoreType> = Partial<{
  store: StoreType;
  stage: keyof StoreType;
  handlePrev: () => void;
  handleNext: () => void;
  handleBlockValueChange: <K extends keyof StoreType>(
    blockId: K,
    value: StoreType[K]
  ) => void;
  handleStageChange: <K extends keyof StoreType>(_: K) => void;
  defaultValues: Partial<StoreType>;
}>;

type TStagesBlockReturn<FieldType> = ({
  active,
  handlePrev,
  handleNext,
  value,
  handleChange,
  handleBlur,
}: TStagesBlockParams<FieldType>) => TBlockSetupParams;

function getNextArrayElement<T extends any>(currentItem: T, array: T[]): T {
  const currentIndex = array.indexOf(currentItem);
  const nextIndex = currentIndex + 1;
  return array[nextIndex];
}

function getPrevArrayElement<T extends any>(currentItem: T, array: T[]): T {
  const currentIndex = array.indexOf(currentItem);
  const prevIndex = currentIndex - 1;
  return array[prevIndex];
}

const RootContext = createContext<StagesContextType<any>>({});

function Root<T>({
  defaultValues,
  onChange,
  onStageChange,
  children,
}: TStagesBlockProps<T>) {
  const [stage, setCurrentStage] = useState<keyof T>(
    Object.keys(defaultValues as any)[0] as any
  );
  const [store, setStore] = useState<T>(defaultValues);

  const handleBlockValueChange = (blockId: keyof T, value: any) => {
    setStore((prev) => ({ ...prev, [blockId]: value }));
  };

  const handleStageChange = (stage: keyof T) => {
    setCurrentStage(stage);
  };

  const handleNextStage = useCallback(() => {
    setCurrentStage(
      (prev: any) =>
        getNextArrayElement<string>(prev, Object.keys(store as any)) as any
    );
  }, [stage, setCurrentStage]);

  const handlePrevStage = useCallback(() => {
    setCurrentStage(
      (prev: any) =>
        getPrevArrayElement<string>(prev, Object.keys(store as any)) as any
    );
  }, [stage, setCurrentStage]);

  useEffect(() => {
    onChange?.(store);
  }, [store]);

  useEffect(() => {
    onStageChange?.(stage);
  }, [stage]);

  return (
    <RootContext.Provider
      value={{
        store,
        stage,
        handleStageChange: (stage) => handleStageChange(stage as any),
        handleBlockValueChange: handleBlockValueChange as any,
        handleNext: handleNextStage,
        handlePrev: handlePrevStage,
        defaultValues: defaultValues as any,
      }}
    >
      <Timeline.Root>{children.map((block: any) => block)}</Timeline.Root>
    </RootContext.Provider>
  );
}

function Block<T extends any = any, K extends keyof T = keyof T>({
  name,
  icon,
  label,
  children,
}: TStageBlockProps<T, K>): React.ReactNode {
  const {
    handleNext,
    stage,
    handlePrev,
    store,
    handleBlockValueChange,
    handleStageChange,
  } = useContext(RootContext);

  const disabled = useMemo(() => {
    const prevStageName = getPrevArrayElement<K>(
      name as any,
      Object.keys(store) as any
    );
    if (!prevStageName) {
      return false;
    }

    const prevStageValue = store[prevStageName];
    return !prevStageValue;
  }, [store, stage]);

  const active = useMemo(() => stage === name, [stage, name]);
  const value = useMemo(() => store?.[name], [name, store]);

  return (
    <Timeline.Item
      key={`${name as any}`}
      onClick={() => !disabled && handleStageChange?.(name as any)}
    >
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator
          transition="scale 0.3s"
          scale={active ? 1.5 : 1}
          border={active ? "1px solid gray" : undefined}
          colorPalette={"purple"}
          bg={!active ? "purple.800" : undefined}
        >
          {icon}
        </Timeline.Indicator>
      </Timeline.Connector>
      <Timeline.Content>
        <Timeline.Title>{label(active, value)}</Timeline.Title>
        {active &&
          children({
            handlePrev: handlePrev!,
            handleNext: handleNext!,
            active: name === stage!,
            value: value,
            handleChange: (value: T[K]) =>
              handleBlockValueChange?.(name, value),
            handleBlur: () => null,
          })}
      </Timeline.Content>
    </Timeline.Item>
  );
}

export const StageBlockForm = {
  Root,
  Block,
};
