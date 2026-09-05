type BenefitTextProps = {
  num: string;
  title: string;
  description: string;
};

export function BenefitText({ num, title, description }: BenefitTextProps) {
  return (
    <>
      <p className='font-mono text-muted-foreground text-xs tracking-widest'>{num}</p>
      <h3 className='mt-2 font-medium text-foreground text-xl tracking-tight lg:text-2xl'>
        {title}
      </h3>
      <p className='mt-3 text-muted-foreground text-sm leading-relaxed lg:text-[15px] lg:leading-relaxed'>
        {description}
      </p>
    </>
  );
}
