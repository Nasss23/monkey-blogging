import { Button } from 'components/button';
import { Radio } from 'components/checkbox';
import { Field, FieldCheckboxes } from 'components/field';
import { Input } from 'components/input';
import { Label } from 'components/label';
import DashboardHeading from 'drafts/DashboardHeading';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

const CategoryUpdate = () => {
    const { control } = useForm({
        mode: "onChange",
        defaultValues: {

        }
    })
    const [params] = useSearchParams();
    console.log('params: ', params.get('id'));
    const categoryId = params.get('id');
    if (!categoryId) return null;
    return (
        <div>
            <DashboardHeading
                title='Update category'
                desc={`Update your category id: ${categoryId}`}></DashboardHeading>
            <form autoComplete='of'>
                <div className='form-layout'>
                    <Field>
                        <Label>Name</Label>
                        <Input
                            control={control}
                            name='name'
                            placeholder='Enter your category name'
                            required></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input
                            control={control}
                            name='slug'
                            placeholder='Enter your slug'></Input>
                    </Field>
                </div>
                <div className='form-layout'>
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio
                                name='status'
                                control={control}
                            // checked={Number(watchStatus) === categoryStatus.APPROVED}
                            // value={categoryStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name='status'
                                control={control}
                            // checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
                            // value={categoryStatus.UNAPPROVED}
                            >
                                Unapproved
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <Button kind='primary' className='mx-auto w-[230px]' type='submit' >
                    Update category
                </Button>
            </form>
        </div>
    );
};

export default CategoryUpdate;
