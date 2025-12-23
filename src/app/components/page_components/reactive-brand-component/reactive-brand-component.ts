import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { PageEvent } from '@angular/material/paginator';
import { DashboardModeEnum } from '../../../config/enums/dashboardModeEnum';
import { BrandModel } from '../../../models/api_models/brandModel';
import { BrandService } from '../../../services/api_services/brandService';

@Component({
  selector: 'app-reactive-brand-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './reactive-brand-component.html',
  styleUrl: './reactive-brand-component.scss',
})
export class ReactiveBrandComponent {


  // ======================================================
  // INJECT
  // ======================================================
  private fb = inject(FormBuilder);
  private brandService = inject(BrandService);

  // ======================================================
  // STATE
  // ======================================================
  brands = signal<BrandModel[]>([]);
  loading!: Signal<boolean>;

  pageNumber = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);

  displayedColumns = ['brandName', 'createdAt', 'actions'];

  // ======================================================
  // FORM (STRICT + NON NULLABLE)
  // ======================================================
  brandForm = this.fb.nonNullable.group({
    brandName: [
      '',
      [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)],
    ],
  });

  searchControl = new FormControl('');

  // ======================================================
  // MODE
  // ======================================================
  selectedBrandId = signal<number | null>(null);
  formMode = signal<DashboardModeEnum>(DashboardModeEnum.CREATE);

  isEditMode = computed(() => this.formMode() === DashboardModeEnum.EDIT);
  isViewMode = computed(() => this.formMode() === DashboardModeEnum.VIEW);

  // ======================================================
  // REQUEST PARAMS
  // ======================================================
  requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    searchKey: this.searchControl.value || undefined,
  }));

  constructor() {
    this.loading = this.brandService.loading;

    effect(() => this.loadBrands());

    this.searchControl.valueChanges.subscribe(() => {
      this.pageNumber.set(1);
      this.loadBrands();
    });
  }

  // ======================================================
  // LOADERS
  // ======================================================
  private loadBrands(): void {
    const params = this.requestParams();

    this.brandService
      .getBrandPaged(params.pageNumber, params.pageSize, params.searchKey)
      .subscribe(res => {
        this.brands.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  private loadToForm(
    brand: BrandModel,
    mode: DashboardModeEnum
  ): void {
    this.selectedBrandId.set(brand.brandID ?? null);
    this.formMode.set(mode);

    this.brandForm.patchValue({
      brandName: brand.brandName,
    });

    mode === DashboardModeEnum.VIEW
      ? this.brandForm.disable()
      : this.brandForm.enable();
  }

  private resetForm(): void {
    this.brandForm.reset();
    this.brandForm.enable();
    this.selectedBrandId.set(null);
    this.formMode.set(DashboardModeEnum.CREATE);
  }

  // ======================================================
  // CRUD
  // ======================================================
  view(brand: BrandModel): void {
    this.loadToForm(brand, DashboardModeEnum.VIEW);
  }

  edit(brand: BrandModel): void {
    this.loadToForm(brand, DashboardModeEnum.EDIT);
  }

  onSubmit(): void {
    if (this.brandForm.invalid || this.isViewMode()) return;

    this.isEditMode() ? this.update() : this.save();
  }

  save(): void {
    const formValue = this.brandForm.getRawValue();

    const payload: BrandModel = {
      brandName: formValue.brandName,
    };

    this.brandService.create(payload).subscribe(() => {
      this.resetForm();
      this.loadBrands();
    });
  }

  update(): void {
    if (!this.selectedBrandId()) return;

    const formValue = this.brandForm.getRawValue();

    const payload: BrandModel = {
      brandID: this.selectedBrandId()!,
      brandName: formValue.brandName,
    };

    this.brandService.update(payload.brandID!, payload).subscribe(() => {
      this.resetForm();
      this.loadBrands();
    });
  }

  delete(brand: BrandModel): void {
    this.brandService.delete(brand.brandID!).subscribe(() => {
      this.loadBrands();
    });
  }

  cancel(): void {
    this.resetForm();
  }

  // ======================================================
  // PAGINATION
  // ======================================================
  onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }
}
