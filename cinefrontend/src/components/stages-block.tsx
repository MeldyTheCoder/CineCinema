import { Timeline } from "@chakra-ui/react";
import React, {
  useEffect,
  useContext,
  createContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { getNextArrayElement, getPrevArrayElement } from "../utils/arrays";
import { ZodSchema } from "zod";

type TStageBlockProps<T, K extends keyof T = keyof T> = {
  readonly name: K;
  readonly icon: React.ReactNode;
  readonly validator: ZodSchema;
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

  // Обработка изменения значений блока
  const handleBlockValueChange = (blockId: keyof T, value: any) => {
    setStore((prev) => ({ ...prev, [blockId]: value }));
  };

  // Смена этапа формы
  const handleStageChange = (stage: keyof T) => {
    setCurrentStage(stage);
  };

  // Следующий этап формы
  const handleNextStage = useCallback(() => {
    const nextStage = getNextArrayElement<string>(
      stage as string,
      Object.keys(store as any)
    ) as keyof T;
    if (!nextStage) {
      return;
    }
    handleStageChange(nextStage);
  }, [stage, store, handleStageChange]);

  // Предыдущий этап формы
  const handlePrevStage = useCallback(() => {
    const prevStage = getPrevArrayElement<string>(
      stage as string,
      Object.keys(store as any)
    ) as keyof T;
    if (!prevStage) {
      return;
    }
    handleStageChange(prevStage);
  }, [stage, store, handleStageChange]);

  useEffect(() => {
    onChange?.(store);
  }, [store]);

  useEffect(() => {
    onStageChange?.(stage);
  }, [stage]);

  useEffect(() => {
    addEventListener("keydown", (event) => {
      switch (event.code) {
        case "ArrowDown":
          handleNextStage();
          return;
        case "ArrowUp":
          handlePrevStage();
          return;
        default:
          return;
      }
    });
  }, []);

  return (
    <RootContext.Provider
      value={{
        store,
        stage,
        handleStageChange: (stage) => handleStageChange(stage as any),
        handleBlockValueChange: handleBlockValueChange as any,
        handleNext: () => handleNextStage(),
        handlePrev: () => handlePrevStage(),
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
  validator,
  children,
}: TStageBlockProps<T, K>): React.ReactNode {
  const {
    store,
    stage,
    handleNext,
    handlePrev,
    handleBlockValueChange,
    handleStageChange,
  } = useContext(RootContext);

  // Состояние блока (вкл/выкл)
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

  // Активный ли блок
  const active = useMemo(() => stage === name, [stage, name]);

  // Значение блока
  const value = useMemo(() => store?.[name], [name, store]);

  // const stageNames = Object.keys(store).map((_s) => `${_s}`) as (keyof T)[];
  // const prevStage = getPrevArrayElement<keyof T>(name, stageNames);
  // const nextStage = getNextArrayElement<keyof T>(name, stageNames);

  const handleNextStage = () => {
    validator.safeParseAsync(value).then(() => handleNext?.());
  };

  const handlePrevStage = () => {
    handlePrev?.();
  };

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
            active: active,
            value: value,
            handlePrev: handlePrevStage,
            handleNext: handleNextStage,
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
